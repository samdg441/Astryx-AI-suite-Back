import type {
  ContactLeadListFilters,
  ContactLeadRepository,
} from "../../domain/repositories/contactLeadRepository";

export class ListContactLeads {
  constructor(private readonly contactLeadRepository: ContactLeadRepository) {}

  execute(filters: ContactLeadListFilters, page: number, limit: number) {
    return this.contactLeadRepository.findMany(filters, page, limit);
  }
}
