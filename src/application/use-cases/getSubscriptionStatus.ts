import { getCurrentUser } from "./getCurrentUser";

export type SubscriptionStatusDto = {
  planType: string | null;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
};

export async function getSubscriptionStatus(userId: number): Promise<SubscriptionStatusDto> {
  const user = await getCurrentUser(userId);
  return {
    planType: user.planType,
    subscriptionStatus: user.subscriptionStatus,
    stripeCustomerId: user.stripeCustomerId ?? null,
  };
}
