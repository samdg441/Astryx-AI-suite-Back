import Stripe from "stripe";
import { prisma } from "../../infrastructure/database/prismaClient";
import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";

export type CheckoutPriceTier = "basico" | "pro" | "empresarial";

export type CreateCheckoutSessionInput = {
  userId: number;
  priceTier: CheckoutPriceTier;
};

export type CreateCheckoutSessionResult = {
  url: string;
};

/** Básico y Pro comparten planType `pro` en BD (distinto precio Stripe); Empresarial es `empresarial`. */
function metadataPlanType(tier: CheckoutPriceTier): "pro" | "empresarial" {
  return tier === "empresarial" ? "empresarial" : "pro";
}

function resolveStripePriceId(tier: CheckoutPriceTier): string {
  const id =
    tier === "empresarial"
      ? env.STRIPE_PRICE_EMPRESARIAL
      : tier === "basico"
        ? env.STRIPE_PRICE_BASICO
        : env.STRIPE_PRICE_PRO;
  if (!id) {
    throw new HttpError(
      503,
      `Falta STRIPE_PRICE_${tier === "empresarial" ? "EMPRESARIAL" : tier === "basico" ? "BASICO" : "PRO"} en el entorno del API.`,
    );
  }
  return id;
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult> {
  if (!env.STRIPE_SECRET_KEY) {
    throw new HttpError(503, "STRIPE_SECRET_KEY no está configurada en el API.");
  }

  const user = await prisma.user.findFirst({
    where: { id: input.userId, isActive: true },
  });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const priceId = resolveStripePriceId(input.priceTier);
  const planTypeMeta = metadataPlanType(input.priceTier);

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: String(user.id) },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const base = env.FRONTEND_URL.replace(/\/$/, "");
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/checkout/cancel`,
    metadata: {
      userId: String(user.id),
      planType: planTypeMeta,
      priceTier: input.priceTier,
    },
    subscription_data: {
      metadata: {
        userId: String(user.id),
        planType: planTypeMeta,
      },
    },
  });

  if (!session.url) {
    throw new HttpError(502, "Stripe no devolvió URL de checkout");
  }

  return { url: session.url };
}
