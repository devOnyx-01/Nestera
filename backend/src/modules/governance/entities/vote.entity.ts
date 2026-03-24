import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { GovernanceProposal } from './governance-proposal.entity';

export enum VoteDirection {
  AGAINST = 0,
  FOR = 1,
}

@Entity('votes')
@Index(['walletAddress', 'proposal'], { unique: true })
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletAddress: string;

  /** 1 = For, 0 = Against */
  @Column({ type: 'int' })
  direction: VoteDirection;

  @Column({ nullable: true, type: 'varchar' })
  weight: string;

  @ManyToOne(() => GovernanceProposal, (proposal) => proposal.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proposalId' })
  proposal: GovernanceProposal;

  @Column()
  proposalId: string;

  @CreateDateColumn()
  createdAt: Date;
}
