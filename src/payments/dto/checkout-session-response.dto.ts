import { ApiProperty } from '@nestjs/swagger';

export class CheckoutSessionResponseDto {
  @ApiProperty({
    description: 'Stripe checkout session ID',
    example: 'cs_test_1234567890',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Stripe checkout URL',
    example: 'https://checkout.stripe.com/pay/cs_test_1234567890',
  })
  url: string;
} 