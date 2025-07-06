import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @Request() req) {
    console.log(">>>>>>>>>>>> createProfileDto >>>>>>>>>>>>",createProfileDto);
    return this.profilesService.create(createProfileDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all profiles for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Profiles retrieved successfully' })
  @Get()
  findAll(@Request() req) {
    return this.profilesService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.profilesService.findOne(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    return this.profilesService.update(id, updateProfileDto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.profilesService.remove(id, req.user.id);
  }
} 