import type { CreateContactLeadInput } from "../../domain/entities/contactLead";
import type { ContactLeadRepository } from "../../domain/repositories/contactLeadRepository";

export class CreateContactLead {
  constructor(private readonly contactLeadRepository: ContactLeadRepository) {}

  execute(input: CreateContactLeadInput) {
    return this.contactLeadRepository.create(input);
  }
}
