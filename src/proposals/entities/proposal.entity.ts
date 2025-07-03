import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../profiles/entities/profile.entity';

export enum ProposalStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ENHANCED = 'enhanced',
  ARCHIVED = 'archived',
}

@Entity('proposals')
export class Proposal extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.DRAFT,
  })
  status: ProposalStatus;

  @Column({ type: 'text', nullable: true })
  clientName: string;

  @Column({ type: 'text', nullable: true })
  projectDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'text', nullable: true })
  timeline: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => User, user => user.proposals, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Profile, profile => profile.proposals, { onDelete: 'CASCADE' })
  profile: Profile;

  @Column()
  profileId: string;
} 