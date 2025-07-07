import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsageService } from '../payments/usage.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    private usageService: UsageService,
  ) {}

  async create(createProfileDto: CreateProfileDto, userId: string): Promise<Profile> {
    // Check usage limits
    await this.usageService.checkAndThrowIfLimitReached(userId, 'profile');

    const profile = this.profilesRepository.create({
      ...createProfileDto,
      userId,
    });

    const savedProfile = await this.profilesRepository.save(profile);
    
    // Increment usage after successful creation
    await this.usageService.incrementUsageAfterCreation(userId, 'profile');
    
    return savedProfile;
  }

  async findAll(userId: string): Promise<Profile[]> {
    return this.profilesRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async findOne(id: string, userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only access your own profiles');
    }

    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto, userId: string): Promise<Profile> {
    const profile = await this.findOne(id, userId);
    
    Object.assign(profile, updateProfileDto);
    return this.profilesRepository.save(profile);
  }

  async remove(id: string, userId: string): Promise<void> {
    const profile = await this.findOne(id, userId);
    await this.profilesRepository.remove(profile);
  }
} 