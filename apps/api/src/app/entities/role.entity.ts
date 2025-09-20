import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Organization } from './organization.entity';

/*
  Role is scoped to an Organization and has Permissions.

  Role
    id: string (UUID)
    name: 'Owner' | 'Admin' | 'Viewer'
    organizationId: string (FK)
    permissions: Permission[] (array of Permission Ids)
    createdAt: Date
    updatedAt: Date
*/

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: 'Owner' | 'Admin' | 'Viewer';

  @ManyToOne(() => Organization)
  organizationId: Organization['id'];

  @ManyToOne(() => Permission)
  permissionIds: [Permission['id']];

  @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | null;

  @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
}
