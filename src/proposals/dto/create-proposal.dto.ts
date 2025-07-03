import { IsString, IsOptional, IsNumber, IsUUID, IsEnum } from 'class-validator';
import { ProposalStatus } from '../entities/proposal.entity';

export class CreateProposalDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  projectDescription?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  timeline?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsUUID()
  profileId: string;
} 