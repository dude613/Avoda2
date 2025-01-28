import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Organization } from './organization.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  @Exclude({ toClassOnly: true })
  password: string;

  // One user can have many organizations.
  @OneToMany(() => Organization, (organization) => organization.owner_id)
  organizations: Organization[];

  /** User rate. This column could be null because the org/project could have a set rate. */
  @Column({ nullable: true })
  rate: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
