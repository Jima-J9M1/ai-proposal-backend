import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { AdminOnly, SuperAdminOnly } from '../common/decorators/admin.decorator';
import { AdminService } from './admin.service';
import { AdminPaginationDto } from './dto/admin-pagination.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
import { UserListResponseDto } from './dto/user-list-response.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard
  @Get('dashboard')
  @AdminOnly()
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard stats retrieved successfully',
    type: DashboardStatsResponseDto
  })
  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    return await this.adminService.getDashboardStats();
  }

  // User Management
  @Get('users')
  @AdminOnly()
  @ApiOperation({ summary: 'Get all users with pagination and filters' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: UserListResponseDto
  })
  async getAllUsers(@Query() query: AdminPaginationDto): Promise<UserListResponseDto> {
    return await this.adminService.getAllUsers(query);
  }

  @Get('users/:id')
  @AdminOnly()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserById(@Param('id') id: string) {
    return await this.adminService.getUserById(id);
  }

  @Patch('users/:id')
  @AdminOnly()
  @ApiOperation({ summary: 'Update user by admin' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserAdminDto
  ) {
    return await this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @SuperAdminOnly()
  @ApiOperation({ summary: 'Delete user (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async deleteUser(@Param('id') id: string) {
    return await this.adminService.deleteUser(id);
  }

  // Subscription Management
  @Get('subscriptions')
  @AdminOnly()
  @ApiOperation({ summary: 'Get all subscriptions with pagination' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully' })
  async getAllSubscriptions(@Query() query: AdminPaginationDto) {
    return await this.adminService.getAllSubscriptions(query);
  }

  @Patch('subscriptions/:id')
  @AdminOnly()
  @ApiOperation({ summary: 'Update subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updates: any
  ) {
    return await this.adminService.updateSubscription(id, updates);
  }

  @Post('subscriptions/:id/override-limits')
  @AdminOnly()
  @ApiOperation({ summary: 'Override subscription limits' })
  @ApiResponse({ status: 200, description: 'Limits overridden successfully' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  async overrideLimits(
    @Param('id') id: string,
    @Body() limits: { profilesLimit?: number; proposalsLimit?: number }
  ) {
    return await this.adminService.overrideLimits(id, limits);
  }

  // Analytics
  @Get('analytics/users')
  @AdminOnly()
  @ApiOperation({ summary: 'Get user analytics' })
  @ApiResponse({ status: 200, description: 'User analytics retrieved successfully' })
  async getUserAnalytics(@Query() query: DateRangeDto) {
    return await this.adminService.getUserAnalytics(query);
  }

  @Get('analytics/revenue')
  @AdminOnly()
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiResponse({ status: 200, description: 'Revenue analytics retrieved successfully' })
  async getRevenueAnalytics(@Query() query: DateRangeDto) {
    return await this.adminService.getRevenueAnalytics(query);
  }

  @Get('analytics/usage')
  @AdminOnly()
  @ApiOperation({ summary: 'Get usage analytics' })
  @ApiResponse({ status: 200, description: 'Usage analytics retrieved successfully' })
  async getUsageAnalytics(@Query() query: DateRangeDto) {
    return await this.adminService.getUsageAnalytics(query);
  }

  @Get('analytics/plan-distribution')
  @AdminOnly()
  @ApiOperation({ summary: 'Get plan distribution analytics' })
  @ApiResponse({ status: 200, description: 'Plan distribution retrieved successfully' })
  async getPlanDistribution() {
    return await this.adminService.getPlanDistribution();
  }

  // System Management
  @Get('system/health')
  @AdminOnly()
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health retrieved successfully' })
  async getSystemHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    };
  }
} 