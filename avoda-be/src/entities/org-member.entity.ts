import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';

type MemberRole = 'member' | 'owner';

@Entity('org_member')
export class OrgMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrgMember, (orgMember) => orgMember.organization_id)
  members: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Organization, (org) => org.id)
  organization_id: Organization;

  @Column()
  role: MemberRole;

  @Column()
  permissions: string;
}
