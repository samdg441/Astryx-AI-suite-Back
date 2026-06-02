const RANK: Record<string, number> = {
  sin_plan: 0,
  free: 0,
  basico: 1,
  pro: 2,
  empresarial: 3,
};

export function planRank(plan: string | null | undefined): number {
  if (!plan) return 0;
  return RANK[plan] ?? 0;
}

export function canAccessPlan(
  userPlan: string | null | undefined,
  requiredPlan: string | undefined | null,
): boolean {
  const req = requiredPlan ?? "free";
  return planRank(userPlan) >= planRank(req);
}
