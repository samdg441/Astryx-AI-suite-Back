import type { ContactLeadRepository } from "../../domain/repositories/contactLeadRepository";
import { HttpError } from "../../shared/errors/httpError";

export class GetContactLeadById {
  constructor(private readonly contactLeadRepository: ContactLeadRepository) {}

  async execute(id: string) {
    const lead = await this.contactLeadRepository.findById(id);
    if (!lead) {
      throw new HttpError(404, "Contact lead not found");
    }
    return lead;
  }
}
