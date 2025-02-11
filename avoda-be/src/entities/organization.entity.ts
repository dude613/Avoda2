import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from './user.entity';
import { Project } from './project.entity';
import { OrganizationMembers } from './org-member.entity';
import { InvitesRepository } from './invites.entity';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  rate: number;

  // An organization must belong to a user
  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  createdBy: User;

  @OneToMany(() => OrganizationMembers, (member) => member.organization, {
    onDelete: 'CASCADE',
  })
  members: OrganizationMembers[];

  @OneToMany(() => Project, (project) => project.organization_id)
  projects: Project[];

  @OneToMany(() => InvitesRepository, (invites) => invites.organization)
  invites: InvitesRepository[];

  // 1 stands for true, 0 stands for false
  @Column({ default: 1, type: 'smallint' })
  @Exclude({ toPlainOnly: true })
  isDefaultOrg: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
