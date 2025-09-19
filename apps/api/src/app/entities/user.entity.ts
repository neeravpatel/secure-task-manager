import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @ManyToOne(() => Role)
  @JoinTable()
  role: Role[];

  @Column({ type: 'datetime', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date | null;
}
