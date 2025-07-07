import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class UserListItemDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid'
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  fullName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER
  })
  role: UserRole;

  @ApiProperty({
    description: 'Whether user is active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether email is verified',
    example: true
  })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User subscription info',
    required: false
  })
  subscription?: any;
}

export class UserListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserListItemDto]
  })
  users: UserListItemDto[];

  @ApiProperty({
    description: 'Pagination information'
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 