import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // An organization must belong to a user
  @ManyToOne(() => User, (user) => user.organizations)
  owner_id: User;

  @OneToMany(() => Project, (project) => project.organization_id)
  projects: Project[];

  @Column()
  name: string;

  @Column({ nullable: true })
  rate: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
