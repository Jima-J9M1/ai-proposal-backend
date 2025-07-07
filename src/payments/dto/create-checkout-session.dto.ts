import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: 'Stripe price ID for the subscription plan',
    example: 'price_basic',
  })
  @IsString()
  @IsNotEmpty()
  priceId: string;
} 