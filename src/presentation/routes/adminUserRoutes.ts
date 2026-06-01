import { Router } from "express";
import { listUsersAdmin } from "../../application/use-cases/listUsersAdmin";
import {
  buildPaginationMeta,
  parsePaginationQuery,
} from "../../shared/http/pagination";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAdmin } from "../../shared/http/requireAdmin";
import { requireAuth } from "../../shared/http/requireAuth";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (request, response) => {
    const { page, limit } = parsePaginationQuery(request);
    const result = await listUsersAdmin(page, limit);
    response.status(200).json({
      data: result.items.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        globalRole: u.globalRole,
        planType: u.planType,
        subscriptionStatus: u.subscriptionStatus,
        isActive: u.isActive,
        createdAt: u.createdAt,
      })),
      meta: buildPaginationMeta(page, limit, result.total),
    });
  }),
);

export { router as adminUserRoutes };
