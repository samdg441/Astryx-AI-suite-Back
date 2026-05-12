import type { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../infrastructure/database/prismaClient";
import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";

function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new HttpError(503, "STRIPE_SECRET_KEY no configurada");
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}

/**
 * Webhook Stripe: body debe ser el **raw** (Buffer), sin `express.json()`.
 * Ver documentación: https://stripe.com/docs/webhooks/signature
 */
export async function stripeWebhookHandler(request: Request, response: Response): Promise<void> {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new HttpError(503, "STRIPE_WEBHOOK_SECRET no configurada");
  }

  const signature = request.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    throw new HttpError(400, "Falta cabecera stripe-signature");
  }

  const rawBody = Buffer.isBuffer(request.body)
    ? request.body
    : typeof request.body === "string"
      ? Buffer.from(request.body)
      : null;
  if (!rawBody) {
    throw new HttpError(400, "Body del webhook debe ser raw (Buffer o string)");
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    throw new HttpError(400, `Webhook signature verification failed: ${msg}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") {
        break;
      }
      const userIdRaw = session.metadata?.userId;
      const planType = session.metadata?.planType;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!Number.isFinite(userId) || (planType !== "pro" && planType !== "empresarial")) {
        break;
      }
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

      await prisma.user.update({
        where: { id: userId },
        data: {
          planType,
          subscriptionStatus: "active",
          ...(customerId ? { stripeCustomerId: customerId } : {}),
          ...(subscriptionId ? { stripeSubscriptionId: subscriptionId } : {}),
        },
      });
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const row = await prisma.user.findFirst({
        where: { stripeSubscriptionId: sub.id },
        select: { id: true },
      });
      if (!row) break;
      if (sub.status === "past_due") {
        await prisma.user.update({
          where: { id: row.id },
          data: { subscriptionStatus: "past_due" },
        });
      } else if (sub.status === "active") {
        await prisma.user.update({
          where: { id: row.id },
          data: { subscriptionStatus: "active" },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          planType: "free",
          subscriptionStatus: "inactive",
          stripeSubscriptionId: null,
        },
      });
      break;
    }
    default:
      break;
  }

  response.status(200).json({ received: true });
}
