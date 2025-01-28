import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';

enum MEMBER_ROLES {
  'MEMBER',
  'OWNER',
}

enum MEMBER_PERMISSIONS {
  'READ:TASK',
  'WRITE:UPDATE',
  'DELETE:TASK',
  'UPDATE:TASK',
}

@Entity('org_member')
export class OrgMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrgMember, (orgMember) => orgMember.organization_id)
  members: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Organization, (org) => org.id, { onDelete: 'CASCADE' })
  organization_id: Organization;

  @Column({ default: MEMBER_ROLES.MEMBER, type: 'enum', enum: MEMBER_ROLES })
  role: MEMBER_ROLES;

  @Column({
    type: 'enum',
    enum: MEMBER_PERMISSIONS,
    default: `${MEMBER_PERMISSIONS['READ:TASK']}`,
  })
  permissions: MEMBER_PERMISSIONS;
}
