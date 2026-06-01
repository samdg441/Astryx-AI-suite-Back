import type { UpdateContactLeadInput } from "../../domain/entities/contactLead";
import type { ContactLeadRepository } from "../../domain/repositories/contactLeadRepository";
import { HttpError } from "../../shared/errors/httpError";

export class UpdateContactLead {
  constructor(private readonly contactLeadRepository: ContactLeadRepository) {}

  async execute(id: string, input: UpdateContactLeadInput) {
    const updated = await this.contactLeadRepository.update(id, input);
    if (!updated) {
      throw new HttpError(404, "Contact lead not found");
    }
    return updated;
  }
}
