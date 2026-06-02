import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WebhookService } from './webhook.service';

@Injectable()
export class WebhookRetryScheduler {
  private readonly logger = new Logger(WebhookRetryScheduler.name);

  constructor(private readonly webhookService: WebhookService) {}

  /** Run every minute to pick up deliveries whose nextRetryAt has passed */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleRetries(): Promise<void> {
    try {
      await this.webhookService.retryDue();
    } catch (err) {
      this.logger.error('Webhook retry job failed', (err as Error).message);
    }
  }
}
