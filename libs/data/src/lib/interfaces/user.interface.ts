export interface User {
  id: number;
  email: string;
  passwordHash: string;
  organizationId: number;
  roleId: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
