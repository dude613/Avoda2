import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { MEMBER_PERMISSIONS } from '@/enums/permissions.enum';

enum MEMBER_ROLES {
  MEMBER = 'MEMBER',
  OWNER = 'OWNER',
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
    type: 'varchar',
    default: `${MEMBER_PERMISSIONS.READ_TASK}`,
  })
  permissions: string;
}
