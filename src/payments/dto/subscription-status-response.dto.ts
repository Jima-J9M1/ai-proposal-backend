import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus, SubscriptionPlan } from '../../subscriptions/entities/subscription.entity';

export class SubscriptionStatusResponseDto {
  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Subscription plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.BASIC,
  })
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'Number of profiles used',
    example: 1,
  })
  profilesUsed: number;

  @ApiProperty({
    description: 'Maximum number of profiles allowed',
    example: 5,
  })
  profilesLimit: number;

  @ApiProperty({
    description: 'Number of proposals used',
    example: 3,
  })
  proposalsUsed: number;

  @ApiProperty({
    description: 'Maximum number of proposals allowed',
    example: 15,
  })
  proposalsLimit: number;

  @ApiProperty({
    description: 'Current period end date',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  currentPeriodEnd?: Date;
} 