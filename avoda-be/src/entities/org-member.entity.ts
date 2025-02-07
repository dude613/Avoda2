import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Organization } from './organization.entity';
import { PermissionEntity } from './permissions.entity';
import { User } from './user.entity';
import { InvitesRepository } from './invites.entity';

import { USER_ROLES } from '@/shared/constants/user-role.constants';

@Entity('organization_member')
export class OrganizationMembers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, (org) => org.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => PermissionEntity, (permission) => permission.member)
  @JoinColumn({ name: 'permissions_id' })
  permissions: PermissionEntity[];

  @OneToMany(() => InvitesRepository, (invite) => invite.invitedBy)
  invites: InvitesRepository[];

  @Column({ default: USER_ROLES.OWNER, type: 'enum', enum: USER_ROLES })
  role: USER_ROLES;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
