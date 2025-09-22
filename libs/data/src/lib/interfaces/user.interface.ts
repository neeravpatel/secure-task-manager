export interface User {
  id: string;
  email: string;
  passwordHash: string;
  organizationId: string;
  roleId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
