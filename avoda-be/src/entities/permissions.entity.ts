import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { USER_PERMISSIONS } from '@/enums/permissions.enum';

import { OrganizationMembers } from './org-member.entity';

@Entity('permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrganizationMembers, (member) => member.permissions, {
    onDelete: 'CASCADE',
  })
  member: OrganizationMembers;

  @Column({ type: 'enum', enum: USER_PERMISSIONS })
  permission: USER_PERMISSIONS;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
