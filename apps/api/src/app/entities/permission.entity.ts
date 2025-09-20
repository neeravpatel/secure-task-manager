import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/*
  Permission
    id: string (UUID)
    name: string (e.g., 'create_task', 'edit_task', 'delete_task', 'view_audit_log')
    description: string
*/

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g., 'create_task', 'edit_task', 'delete_task', 'view_audit_log'

  @Column()
  description: string;

  @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | null;

  @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
}
