import type {
  ContactLead,
  CreateContactLeadInput,
  UpdateContactLeadInput,
} from "../entities/contactLead";

export type ContactLeadListFilters = {
  status?: string;
  source?: string;
  search?: string;
};

export type ContactLeadListResult = {
  items: ContactLead[];
  total: number;
};

export interface ContactLeadRepository {
  findMany(
    filters: ContactLeadListFilters,
    page: number,
    limit: number,
  ): Promise<ContactLeadListResult>;
  findById(id: string): Promise<ContactLead | null>;
  create(input: CreateContactLeadInput): Promise<ContactLead>;
  update(id: string, input: UpdateContactLeadInput): Promise<ContactLead | null>;
  delete(id: string): Promise<boolean>;
}
