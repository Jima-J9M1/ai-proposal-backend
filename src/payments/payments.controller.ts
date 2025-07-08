import { Controller, Post, Get, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CheckoutSessionResponseDto } from './dto/checkout-session-response.dto';
import { SubscriptionStatusResponseDto } from './dto/subscription-status-response.dto';
import { UsageLimitsResponseDto } from './dto/usage-limits-response.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  @ApiResponse({ 
    status: 201, 
    description: 'Checkout session created successfully',
    type: CheckoutSessionResponseDto,
  })
  async createCheckoutSession(
    @CurrentUser() user: User,
    @Body() body: CreateCheckoutSessionDto,
  ): Promise<CheckoutSessionResponseDto> {
    const { sessionId, url } = await this.paymentsService.createCheckoutSession(
      user.id,
      body.priceId,
    );

    return {
      sessionId,
      url,
    };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const signature = req.headers['stripe-signature'] as string;

    // Use the raw body for Stripe signature verification
    const payload = req.body;
    try {
      await this.paymentsService.handleWebhook(signature, payload);
      res.status(200).send();
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send();
    }
  }

  @Get('subscription-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscription status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription status retrieved successfully',
    type: SubscriptionStatusResponseDto,
  })
  async getSubscriptionStatus(@CurrentUser() user: User): Promise<SubscriptionStatusResponseDto> {
    return await this.paymentsService.getSubscriptionStatus(user.id);
  }

  @Get('usage-limits/:type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check usage limits for profiles or proposals' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usage limits retrieved successfully',
    type: UsageLimitsResponseDto,
  })
  async checkUsageLimits(
    @CurrentUser() user: User,
    @Param('type') type: 'profile' | 'proposal',
  ): Promise<UsageLimitsResponseDto> {
    return await this.paymentsService.checkUsageLimits(user.id, type);
  }
} 