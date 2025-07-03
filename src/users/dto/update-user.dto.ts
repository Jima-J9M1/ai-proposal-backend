import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsString, IsDate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @IsOptional()
  @IsDate()
  emailVerificationExpires?: Date;

  @IsOptional()
  @IsString()
  passwordResetToken?: string;

  @IsOptional()
  @IsDate()
  passwordResetExpires?: Date;

  @IsOptional()
  @IsString()
  passwordHash?: string;
} 