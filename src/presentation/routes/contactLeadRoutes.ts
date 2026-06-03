import { Router } from "express";
import { CreateContactLead } from "../../application/use-cases/createContactLead";
import { DeleteContactLead } from "../../application/use-cases/deleteContactLead";
import { GetContactLeadById } from "../../application/use-cases/getContactLeadById";
import { ListContactLeads } from "../../application/use-cases/listContactLeads";
import { UpdateContactLead } from "../../application/use-cases/updateContactLead";
import { PrismaContactLeadRepository } from "../../infrastructure/repositories/prismaContactLeadRepository";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAdmin } from "../../shared/http/requireAdmin";
import { requireAuth } from "../../shared/http/requireAuth";
import { ContactLeadController } from "../controllers/contactLeadController";

const router = Router();
const repository = new PrismaContactLeadRepository();
const controller = new ContactLeadController(
  new CreateContactLead(repository),
  new ListContactLeads(repository),
  new GetContactLeadById(repository),
  new UpdateContactLead(repository),
  new DeleteContactLead(repository),
);

router.post("/", asyncHandler(controller.create.bind(controller)));

router.get("/", requireAuth, requireAdmin, asyncHandler(controller.index.bind(controller)));
router.get("/:id", requireAuth, requireAdmin, asyncHandler(controller.show.bind(controller)));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(controller.update.bind(controller)));
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(controller.destroy.bind(controller)),
);

export { router as contactLeadRoutes };
