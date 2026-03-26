import { ApiProperty } from '@nestjs/swagger';
import { LedgerTransactionType } from '../../blockchain/entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: LedgerTransactionType,
  })
  type: LedgerTransactionType;

  @ApiProperty({ description: 'Transaction amount' })
  amount: string;

  @ApiProperty({ description: 'Public key', nullable: true })
  publicKey: string | null;

  @ApiProperty({ description: 'Event ID' })
  eventId: string;

  @ApiProperty({ description: 'Transaction hash', nullable: true })
  transactionHash: string | null;

  @ApiProperty({ description: 'Ledger sequence', nullable: true })
  ledgerSequence: string | null;

  @ApiProperty({ description: 'Pool ID', nullable: true })
  poolId: string | null;

  @ApiProperty({ description: 'Additional metadata', nullable: true })
  metadata: Record<string, unknown> | null;

  @ApiProperty({ description: 'Transaction creation date (ISO 8601)' })
  createdAt: string;

  @ApiProperty({ description: 'Formatted date for display' })
  formattedDate: string;

  @ApiProperty({ description: 'Formatted time for display' })
  formattedTime: string;
}
