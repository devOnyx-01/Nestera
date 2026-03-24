import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernanceProposal } from './entities/governance-proposal.entity';
import { Vote } from './entities/vote.entity';
import { GovernanceIndexerService } from './governance-indexer.service';

@Module({
  imports: [TypeOrmModule.forFeature([GovernanceProposal, Vote])],
  providers: [GovernanceIndexerService],
  exports: [GovernanceIndexerService],
})
export class GovernanceModule {}
