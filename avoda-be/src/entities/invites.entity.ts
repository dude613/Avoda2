import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { OrganizationMembers } from './org-member.entity';

enum INVITE_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('invites')
export class InvitesRepository {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organization, (organization) => organization.invites)
  organization: Organization;

  @ManyToOne(() => OrganizationMembers, (member) => member.invites)
  invitedBy: OrganizationMembers;

  @Column({ enum: INVITE_STATUS, default: INVITE_STATUS.PENDING, type: 'enum' })
  status: INVITE_STATUS;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
