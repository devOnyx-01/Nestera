import { Global, Module } from '@nestjs/common';
import { RateLimitMonitorService } from './services/rate-limit-monitor.service';

@Global()
@Module({
  providers: [RateLimitMonitorService],
  exports: [RateLimitMonitorService],
})
export class CommonModule {}
