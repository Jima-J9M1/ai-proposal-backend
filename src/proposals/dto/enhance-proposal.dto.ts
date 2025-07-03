import { IsString, IsOptional } from 'class-validator';

export class EnhanceProposalDto {
  @IsString()
  @IsOptional()
  instructions?: string;

  @IsString()
  @IsOptional()
  tone?: string;

  @IsString()
  @IsOptional()
  focus?: string;
} 