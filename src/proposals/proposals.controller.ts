import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { EnhanceProposalDto } from './dto/enhance-proposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('proposals')
@ApiBearerAuth()
@Controller('proposals')
@UseGuards(JwtAuthGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @ApiOperation({ summary: 'Create a new proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @Post()
  create(@Body() createProposalDto: CreateProposalDto, @Request() req) {
    return this.proposalsService.create(createProposalDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all proposals for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Proposals retrieved successfully' })
  @Get()
  findAll(@Request() req, @Query('profileId') profileId?: string) {
    if (profileId) {
      return this.proposalsService.findByProfile(profileId, req.user.id);
    }
    return this.proposalsService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get proposal by ID' })
  @ApiResponse({ status: 200, description: 'Proposal retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.proposalsService.findOne(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update proposal by ID' })
  @ApiResponse({ status: 200, description: 'Proposal updated successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProposalDto: UpdateProposalDto, @Request() req) {
    return this.proposalsService.update(id, updateProposalDto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete proposal by ID' })
  @ApiResponse({ status: 200, description: 'Proposal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.proposalsService.remove(id, req.user.id);
  }

  @ApiOperation({ summary: 'Enhance proposal with AI' })
  @ApiResponse({ status: 200, description: 'Proposal enhanced successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  @Post(':id/enhance')
  enhance(@Param('id') id: string, @Body() enhanceProposalDto: EnhanceProposalDto, @Request() req) {
    return this.proposalsService.enhance(id, enhanceProposalDto, req.user.id);
  }
} 