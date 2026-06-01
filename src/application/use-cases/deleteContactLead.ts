import type { ContactLeadRepository } from "../../domain/repositories/contactLeadRepository";
import { HttpError } from "../../shared/errors/httpError";

export class DeleteContactLead {
  constructor(private readonly contactLeadRepository: ContactLeadRepository) {}

  async execute(id: string) {
    const deleted = await this.contactLeadRepository.delete(id);
    if (!deleted) {
      throw new HttpError(404, "Contact lead not found");
    }
  }
}
