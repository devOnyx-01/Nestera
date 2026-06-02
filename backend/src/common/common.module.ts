import { Global, Module } from '@nestjs/common';
import { PiiEncryptionService } from './services/pii-encryption.service';
import { RateLimitMonitorService } from './services/rate-limit-monitor.service';
import { IdempotencyService } from './services/idempotency.service';
import { IdempotencyCleanupService } from './services/idempotency-cleanup.service';
import { CacheModule } from '../modules/cache/cache.module';

@Global()
@Module({
  imports: [CacheModule],
  providers: [
    RateLimitMonitorService,
    PiiEncryptionService,
    IdempotencyService,
    IdempotencyCleanupService,
  ],
  exports: [
    RateLimitMonitorService,
    PiiEncryptionService,
    IdempotencyService,
  ],
})
export class CommonModule {}
