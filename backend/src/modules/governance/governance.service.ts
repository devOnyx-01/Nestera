import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StellarService } from '../blockchain/stellar.service';
import { SavingsService } from '../blockchain/savings.service';
import { UserService } from '../user/user.service';
import { DelegationResponseDto } from './dto/delegation-response.dto';
import { ProposalVotesResponseDto } from './dto/proposal-votes-response.dto';
import { GovernanceProposal } from './entities/governance-proposal.entity';
import { Vote, VoteDirection } from './entities/vote.entity';
import { VotingPowerResponseDto } from './dto/voting-power-response.dto';

@Injectable()
export class GovernanceService {
  constructor(
    private readonly userService: UserService,
    private readonly stellarService: StellarService,
    private readonly savingsService: SavingsService,
    @InjectRepository(GovernanceProposal)
    private readonly proposalRepo: Repository<GovernanceProposal>,
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  async getUserDelegation(userId: string): Promise<DelegationResponseDto> {
    const user = await this.userService.findById(userId);
    if (!user.publicKey) {
      return { delegate: null };
    }
    const delegate = await this.stellarService.getDelegationForUser(
      user.publicKey,
    );
    return { delegate };
  }

  async getUserVotingPower(userId: string): Promise<VotingPowerResponseDto> {
    const user = await this.userService.findById(userId);
    if (!user.publicKey) {
      return { votingPower: '0 NST' };
    }
    // Get NST governance token contract ID from config
    const governanceTokenContractId = process.env.NST_GOVERNANCE_CONTRACT_ID;
    if (!governanceTokenContractId) {
      throw new Error('NST governance token contract ID not configured');
    }
    // Read balance from the NST governance token contract
    const balance = await this.savingsService.getUserVaultBalance(
      governanceTokenContractId,
      user.publicKey,
    );
    // Convert to proper decimal representation (assuming 7 decimals like standard tokens)
    const votingPower = (balance / 10_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return { votingPower: `${votingPower} NST` };
  }

  async getProposalVotesByOnChainId(
    onChainId: number,
    limit = 20,
  ): Promise<ProposalVotesResponseDto> {
    const proposal = await this.proposalRepo.findOneBy({ onChainId });
    if (!proposal) {
      throw new NotFoundException(`Proposal ${onChainId} not found`);
    }

    const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
    const votes = await this.voteRepo.find({
      where: { proposalId: proposal.id },
      order: { createdAt: 'DESC' },
      take: safeLimit,
    });

    let forWeight = 0;
    let againstWeight = 0;
    for (const vote of votes) {
      const voteWeight = Number(vote.weight) || 0;
      if (vote.direction === VoteDirection.FOR) {
        forWeight += voteWeight;
      } else {
        againstWeight += voteWeight;
      }
    }

    return {
      proposalOnChainId: onChainId,
      tally: {
        forVotes: votes.filter((vote) => vote.direction === VoteDirection.FOR)
          .length,
        againstVotes: votes.filter(
          (vote) => vote.direction === VoteDirection.AGAINST,
        ).length,
        forWeight: String(forWeight),
        againstWeight: String(againstWeight),
        totalWeight: String(forWeight + againstWeight),
      },
      recentVoters: votes.map((vote) => ({
        walletAddress: vote.walletAddress,
        direction: vote.direction,
        weight: String(vote.weight),
        votedAt: vote.createdAt.toISOString(),
      })),
    };
  }
}
