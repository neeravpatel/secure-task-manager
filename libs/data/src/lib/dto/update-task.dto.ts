export class UpdateTaskDto {
  title?: string;
  description?: string;
  userId?: number;
  organizationId?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
