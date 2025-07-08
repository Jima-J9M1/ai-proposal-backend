import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../subscriptions/entities/subscription.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey'), {
      apiVersion: '2025-06-30.basil',
    });
  }

  async createCustomer(user: User): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.fullName,
      metadata: {
        userId: user.id,
      },
    });

    return customer.id;
  }

  async createCheckoutSession(userId: string, priceId: string): Promise<{ sessionId: string; url: string }> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['subscription'] 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      customerId = await this.createCustomer(user);
      
      // Create or update subscription record
      if (!user.subscription) {
        const subscription = this.subscriptionRepository.create({
          userId,
          stripeCustomerId: customerId,
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.INACTIVE,
        });
        await this.subscriptionRepository.save(subscription);
      } else {
        user.subscription.stripeCustomerId = customerId;
        await this.subscriptionRepository.save(user.subscription);
      }
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        userId,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get('stripe.webhookSecret'),
    );


    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    const customerId = subscription.customer as string;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subscription', 'subscription')
      .where('subscription.stripeCustomerId = :customerId', { customerId })
      .getOne();

    if (!user || !user.subscription) {
      throw new NotFoundException('User or subscription not found');
    }

    const plan = this.getPlanFromPriceId(subscription.items.data[0].price.id);
    
    user.subscription.status = this.mapStripeStatus(subscription.status);
    user.subscription.plan = plan;
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.stripePriceId = subscription.items.data[0].price.id;
    user.subscription.currentPeriodStart = new Date((subscription as any).current_period_start * 1000);
    user.subscription.currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);
    user.subscription.cancelAtPeriodEnd = (subscription as any).cancel_at_period_end 
      ? new Date((subscription as any).current_period_end * 1000) 
      : null;

    // Update limits based on plan
    const limits = this.getLimitsForPlan(plan);
    user.subscription.profilesLimit = limits.profiles;
    user.subscription.proposalsLimit = limits.proposals;

    await this.subscriptionRepository.save(user.subscription);
  }

  private async handleSubscriptionCancellation(subscription: Stripe.Subscription): Promise<void> {
    const customerId = subscription.customer as string;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subscription', 'subscription')
      .where('subscription.stripeCustomerId = :customerId', { customerId })
      .getOne();

    if (!user || !user.subscription) {
      return;
    }

    user.subscription.status = SubscriptionStatus.CANCELLED;
    user.subscription.plan = SubscriptionPlan.FREE;
    user.subscription.profilesLimit = 2;
    user.subscription.proposalsLimit = 5;

    await this.subscriptionRepository.save(user.subscription);
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    // Handle successful payment
    console.log('Payment succeeded:', invoice.id);
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const customerId = invoice.customer as string;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subscription', 'subscription')
      .where('subscription.stripeCustomerId = :customerId', { customerId })
      .getOne();

    if (!user || !user.subscription) {
      return;
    }

    user.subscription.status = SubscriptionStatus.PAST_DUE;
    await this.subscriptionRepository.save(user.subscription);
  }

  private mapStripeStatus(stripeStatus: string): SubscriptionStatus {
    switch (stripeStatus) {
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'canceled':
        return SubscriptionStatus.CANCELLED;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      default:
        return SubscriptionStatus.INACTIVE;
    }
  }

  private getPlanFromPriceId(priceId: string): SubscriptionPlan {
    // Map your Stripe price IDs to plans
    const priceIdToPlan: Record<string, SubscriptionPlan> = {
      [this.configService.get('stripe.priceIds.basic')]: SubscriptionPlan.BASIC,
      [this.configService.get('stripe.priceIds.premium')]: SubscriptionPlan.PREMIUM,
    };
    
    return priceIdToPlan[priceId] || SubscriptionPlan.FREE;
  }

  private getLimitsForPlan(plan: SubscriptionPlan): { profiles: number; proposals: number } {
    switch (plan) {
      case SubscriptionPlan.BASIC:
        return { profiles: 5, proposals: 15 };
      case SubscriptionPlan.PREMIUM:
        return { profiles: 10, proposals: 50 };
      default:
        return { profiles: 2, proposals: 5 };
    }
  }

  async checkUsageLimits(userId: string, type: 'profile' | 'proposal'): Promise<{
    canCreate: boolean;
    currentUsage: number;
    limit: number;
    needsUpgrade: boolean;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscription'],
    });

    if (!user || !user.subscription) {
      // Create default subscription if none exists
      const subscription = this.subscriptionRepository.create({
        userId,
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.INACTIVE,
        profilesLimit: 2,
        proposalsLimit: 5,
      });
      await this.subscriptionRepository.save(subscription);
      user.subscription = subscription;
    }

    const { subscription } = user;
    const currentUsage = type === 'profile' ? subscription.profilesUsed : subscription.proposalsUsed;
    const limit = type === 'profile' ? subscription.profilesLimit : subscription.proposalsLimit;
    const canCreate = currentUsage < limit;
    const needsUpgrade = !canCreate && subscription.plan === SubscriptionPlan.FREE;

    return {
      canCreate,
      currentUsage,
      limit,
      needsUpgrade,
    };
  }

  async incrementUsage(userId: string, type: 'profile' | 'proposal'): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscription'],
    });

    if (!user || !user.subscription) {
      throw new NotFoundException('User or subscription not found');
    }

    if (type === 'profile') {
      user.subscription.profilesUsed += 1;
    } else {
      user.subscription.proposalsUsed += 1;
    }

    await this.subscriptionRepository.save(user.subscription);
  }

  async getSubscriptionStatus(userId: string): Promise<{
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    profilesUsed: number;
    profilesLimit: number;
    proposalsUsed: number;
    proposalsLimit: number;
    currentPeriodEnd?: Date;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscription'],
    });

    if (!user || !user.subscription) {
      return {
        status: SubscriptionStatus.INACTIVE,
        plan: SubscriptionPlan.FREE,
        profilesUsed: 0,
        profilesLimit: 2,
        proposalsUsed: 0,
        proposalsLimit: 5,
      };
    }

    return {
      status: user.subscription.status,
      plan: user.subscription.plan,
      profilesUsed: user.subscription.profilesUsed,
      profilesLimit: user.subscription.profilesLimit,
      proposalsUsed: user.subscription.proposalsUsed,
      proposalsLimit: user.subscription.proposalsLimit,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
    };
  }
} 