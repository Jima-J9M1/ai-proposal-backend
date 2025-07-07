import { ApiProperty } from '@nestjs/swagger';

export class UsageLimitsResponseDto {
  @ApiProperty({
    description: 'Whether the user can create the resource',
    example: true,
  })
  canCreate: boolean;

  @ApiProperty({
    description: 'Current usage count',
    example: 2,
  })
  currentUsage: number;

  @ApiProperty({
    description: 'Usage limit',
    example: 5,
  })
  limit: number;

  @ApiProperty({
    description: 'Whether the user needs to upgrade their plan',
    example: false,
  })
  needsUpgrade: boolean;
} 