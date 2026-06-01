export type ContactLead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: string;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateContactLeadInput = {
  name: string;
  email: string;
  company?: string;
  message: string;
  source?: string;
  userId?: number | null;
};

export type UpdateContactLeadInput = {
  status?: string;
  company?: string | null;
};
