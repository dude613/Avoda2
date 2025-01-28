import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from './project.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;

  // userId of the individual working on the task
  member_id: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  project_id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
