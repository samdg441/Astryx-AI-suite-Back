export type AiTool = {
  id: number;
  name: string;
  provider: string | null;
  description: string;
  category: string;
  urlApi: string | null;
  /** free | basico | pro | empresarial */
  requiredPlan: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
