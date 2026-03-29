import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SavingsModule } from '../savings/savings.module';
import { AdminController } from './admin.controller';
import { AdminSavingsController } from './admin-savings.controller';
import { AdminWaitlistController } from './admin-waitlist.controller';

@Module({
  imports: [UserModule, SavingsModule],
  controllers: [
    AdminController,
    AdminSavingsController,
    AdminWaitlistController,
  ],
})
export class AdminModule {}
