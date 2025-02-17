import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { INVITE_STATUS } from '@/shared/constants/invite-status.constants';

import { Organization } from './organization.entity';
import { OrganizationMembers } from './org-member.entity';

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

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
