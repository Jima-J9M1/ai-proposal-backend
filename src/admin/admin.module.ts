import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Proposal } from '../proposals/entities/proposal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription, Profile, Proposal])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {} 