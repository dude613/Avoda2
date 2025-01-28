import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Organization } from './organization.entity';
import { Task } from './task.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @Column({ nullable: true })
  rate: number;

  @ManyToOne(() => Organization, (org) => org.projects)
  organization_id: string;

  @OneToMany(() => Task, (task) => task.project_id)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
