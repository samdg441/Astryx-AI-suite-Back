export type SubscriptionPlan = {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  userLimit: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
