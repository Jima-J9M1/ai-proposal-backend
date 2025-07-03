import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @Column()
  name: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', array: true, default: [] })
  skills: string[];

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ type: 'text', nullable: true })
  certifications: string;

  @ManyToOne(() => User, user => user.profiles, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Proposal, proposal => proposal.profile)
  proposals: Proposal[];
} 