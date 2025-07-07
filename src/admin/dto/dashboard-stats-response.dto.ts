import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsResponseDto {
  @ApiProperty({
    description: 'Total number of users',
    example: 1250
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Number of active users',
    example: 980
  })
  activeUsers: number;

  @ApiProperty({
    description: 'Total number of subscriptions',
    example: 450
  })
  totalSubscriptions: number;

  @ApiProperty({
    description: 'Number of active subscriptions',
    example: 420
  })
  activeSubscriptions: number;

  @ApiProperty({
    description: 'Total number of profiles created',
    example: 2100
  })
  totalProfiles: number;

  @ApiProperty({
    description: 'Total number of proposals created',
    example: 3500
  })
  totalProposals: number;

  @ApiProperty({
    description: 'Monthly revenue in USD',
    example: 12500.50
  })
  monthlyRevenue: number;

  @ApiProperty({
    description: 'Total revenue in USD',
    example: 45000.75
  })
  totalRevenue: number;
} 