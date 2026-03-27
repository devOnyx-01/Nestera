import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProposalVotesResponseDto } from './dto/proposal-votes-response.dto';
import { GovernanceService } from './governance.service';

@ApiTags('governance')
@Controller('governance/proposals')
export class GovernanceProposalsController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get(':id/votes')
  @ApiOperation({
    summary: 'Get proposal vote tally and recent voters',
    description:
      'Returns a proposal vote tally plus the most recent voters for a given proposal onChainId.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of recent voter entries to return',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Vote tally and recent voter list for proposal',
    type: ProposalVotesResponseDto,
  })
  getProposalVotes(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<ProposalVotesResponseDto> {
    return this.governanceService.getProposalVotesByOnChainId(id, limit);
  }
}
