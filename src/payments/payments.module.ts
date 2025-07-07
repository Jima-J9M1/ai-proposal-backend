import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { UsageService } from './usage.service';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User]), SubscriptionsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, UsageService],
  exports: [PaymentsService, UsageService],
})
export class PaymentsModule {} 