import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

export interface UsageLimitError {
  message: string;
  currentUsage: number;
  limit: number;
  needsUpgrade: boolean;
  type: 'profile' | 'proposal';
}

@Injectable()
export class UsageService {
  constructor(private paymentsService: PaymentsService) {}

  async checkAndThrowIfLimitReached(
    userId: string,
    type: 'profile' | 'proposal',
  ): Promise<void> {
    const usageCheck = await this.paymentsService.checkUsageLimits(userId, type);
    
    if (!usageCheck.canCreate) {
      const error: UsageLimitError = {
        message: `${type === 'profile' ? 'Profile' : 'Proposal'} limit reached`,
        currentUsage: usageCheck.currentUsage,
        limit: usageCheck.limit,
        needsUpgrade: usageCheck.needsUpgrade,
        type,
      };
      
      throw new BadRequestException(error);
    }
  }

  async incrementUsageAfterCreation(
    userId: string,
    type: 'profile' | 'proposal',
  ): Promise<void> {
    await this.paymentsService.incrementUsage(userId, type);
  }

  async getUsageInfo(userId: string, type: 'profile' | 'proposal') {
    return await this.paymentsService.checkUsageLimits(userId, type);
  }

  async getSubscriptionInfo(userId: string) {
    return await this.paymentsService.getSubscriptionStatus(userId);
  }
} 