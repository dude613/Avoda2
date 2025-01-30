import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Project } from './project.entity';
import { OrganizationMembers } from './org-member.entity';

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

  // 1 stands for true, 0 stands for false
  @Column({ default: 1, type: 'smallint' })
  isDefaultOrg: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
