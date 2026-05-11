import type { ContactLead, CreateContactLeadInput } from "../entities/contactLead";

export interface ContactLeadRepository {
  create(input: CreateContactLeadInput): Promise<ContactLead>;
}
