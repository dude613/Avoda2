import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

import { Organization } from './organization.entity';
import { OrganizationMembers } from './org-member.entity';
import { TimeLog } from './time-log.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  // One user can have many organizations.
  @OneToMany(() => Organization, (organization) => organization.createdBy)
  organizations: Organization[];

  @OneToMany(() => OrganizationMembers, (membership) => membership.organization)
  memberships: OrganizationMembers[];

  @OneToMany(() => TimeLog, (timeLog) => timeLog.status)
  timeLogs: TimeLog[];

  /** User rate. This column could be null because the org/project could have a set rate. */
  @Column({ nullable: true })
  rate: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
