export interface Task {
  id: number;
  title: string;
  description?: string;
  createdUserId: number;
  assigneeUserId: number;
  organizationId: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date | null;
  updatedAt: Date | null;
}
