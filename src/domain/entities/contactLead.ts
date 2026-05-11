export type ContactLead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  createdAt: Date;
};

export type CreateContactLeadInput = {
  name: string;
  email: string;
  company?: string;
  message: string;
  source?: string;
};
