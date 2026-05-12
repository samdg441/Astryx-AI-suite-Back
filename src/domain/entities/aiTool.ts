export type AiTool = {
  id: number;
  name: string;
  provider: string;
  description: string;
  category: string;
  /** free | pro | empresarial */
  requiredPlan: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
