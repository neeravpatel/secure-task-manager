export interface Task {
  id: number;
  title: string;
  description?: string;
  userId: number;
  organizationId: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date | null;
  updatedAt: Date | null;
}
