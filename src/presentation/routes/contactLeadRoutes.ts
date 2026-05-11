import { Router } from "express";
import { CreateContactLead } from "../../application/use-cases/createContactLead";
import { PrismaContactLeadRepository } from "../../infrastructure/repositories/prismaContactLeadRepository";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { ContactLeadController } from "../controllers/contactLeadController";

const router = Router();
const repository = new PrismaContactLeadRepository();
const useCase = new CreateContactLead(repository);
const controller = new ContactLeadController(useCase);

router.post("/", asyncHandler(controller.create.bind(controller)));

export { router as contactLeadRoutes };
