import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../subscriptions/entities/subscription.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Proposal } from '../proposals/entities/proposal.entity';
import { AdminPaginationDto } from './dto/admin-pagination.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { DateRangeDto } from './dto/date-range.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
  ) {}

  // User Management
  async getAllUsers(query: AdminPaginationDto) {
    const { page = 1, limit = 10, search, role, isActive, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
    
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subscription', 'subscription');

    if (search) {
      queryBuilder.where(
        'user.email ILIKE :search OR user.fullName ILIKE :search OR user.username ILIKE :search',
        { search: `%${search}%` }
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    const [users, total] = await queryBuilder
      .orderBy(`user.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subscription', 'profiles', 'proposals']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserAdminDto) {
    const user = await this.getUserById(id);
    
    // Prevent admin from changing their own role
    if (updateUserDto.role && user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot modify super admin role');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot delete super admin');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  // Subscription Management
  async getAllSubscriptions(query: AdminPaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
    
    const queryBuilder = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user');

    if (search) {
      queryBuilder.where(
        'user.email ILIKE :search OR user.fullName ILIKE :search',
        { search: `%${search}%` }
      );
    }

    const [subscriptions, total] = await queryBuilder
      .orderBy(`subscription.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateSubscription(id: string, updates: Partial<Subscription>) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    Object.assign(subscription, updates);
    return this.subscriptionRepository.save(subscription);
  }

  async overrideLimits(id: string, limits: { profilesLimit?: number; proposalsLimit?: number }) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    Object.assign(subscription, limits);
    return this.subscriptionRepository.save(subscription);
  }

  // Dashboard Analytics
  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalProfiles,
      totalProposals,
      monthlyRevenue,
      totalRevenue
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.subscriptionRepository.count(),
      this.subscriptionRepository.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      this.profileRepository.count(),
      this.proposalRepository.count(),
      this.calculateMonthlyRevenue(),
      this.calculateTotalRevenue()
    ]);

    return {
      totalUsers,
      activeUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalProfiles,
      totalProposals,
      monthlyRevenue,
      totalRevenue
    };
  }

  async getUserAnalytics(query: DateRangeDto) {
    const { startDate, endDate, days = 30 } = query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: Between(new Date(startDate), new Date(endDate))
      };
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = {
        createdAt: Between(startDate, endDate)
      };
    }

    return this.userRepository
      .createQueryBuilder('user')
      .select('DATE(user.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where(dateFilter)
      .groupBy('DATE(user.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getRevenueAnalytics(query: DateRangeDto) {
    const { startDate, endDate, days = 30 } = query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: Between(new Date(startDate), new Date(endDate))
      };
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = {
        createdAt: Between(startDate, endDate)
      };
    }

    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('DATE(subscription.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where(dateFilter)
      .andWhere('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
      .groupBy('DATE(subscription.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getUsageAnalytics(query: DateRangeDto) {
    const { startDate, endDate, days = 30 } = query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: Between(new Date(startDate), new Date(endDate))
      };
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = {
        createdAt: Between(startDate, endDate)
      };
    }

    const [profiles, proposals] = await Promise.all([
      this.profileRepository
        .createQueryBuilder('profile')
        .select('DATE(profile.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where(dateFilter)
        .groupBy('DATE(profile.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany(),
      
      this.proposalRepository
        .createQueryBuilder('proposal')
        .select('DATE(proposal.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where(dateFilter)
        .groupBy('DATE(proposal.createdAt)')
        .orderBy('date', 'ASC')
        .getRawMany()
    ]);

    return { profiles, proposals };
  }

  async getPlanDistribution() {
    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('subscription.plan', 'plan')
      .addSelect('COUNT(*)', 'count')
      .groupBy('subscription.plan')
      .getRawMany();
  }

  // Private helper methods
  private async calculateMonthlyRevenue(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const subscriptions = await this.subscriptionRepository.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        createdAt: MoreThanOrEqual(startOfMonth)
      }
    });

    return subscriptions.reduce((total, sub) => {
      const planPrice = this.getPlanPrice(sub.plan);
      return total + planPrice;
    }, 0);
  }

  private async calculateTotalRevenue(): Promise<number> {
    const subscriptions = await this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE }
    });

    return subscriptions.reduce((total, sub) => {
      const planPrice = this.getPlanPrice(sub.plan);
      return total + planPrice;
    }, 0);
  }

  private getPlanPrice(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.BASIC:
        return 29.99;
      case SubscriptionPlan.PREMIUM:
        return 99.99;
      default:
        return 0;
    }
  }
} 