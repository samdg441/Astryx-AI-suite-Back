import { planRank } from "./planAccess";

export type FilePlanLimits = {
  maxFileBytes: number;
  maxFiles: number;
};

const LIMITS: Record<string, FilePlanLimits> = {
  free: { maxFileBytes: 5 * 1024 * 1024, maxFiles: 5 },
  basico: { maxFileBytes: 10 * 1024 * 1024, maxFiles: 20 },
  pro: { maxFileBytes: 20 * 1024 * 1024, maxFiles: 50 },
  empresarial: { maxFileBytes: 50 * 1024 * 1024, maxFiles: 100 },
};

export function getFileLimitsForPlan(plan: string | null | undefined): FilePlanLimits {
  if (!plan || planRank(plan) === 0) {
    return LIMITS.free;
  }
  return LIMITS[plan] ?? LIMITS.free;
}

export const ALLOWED_FILE_MIMES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
]);

export const MAX_EXTRACTED_TEXT_CHARS = 12_000;
