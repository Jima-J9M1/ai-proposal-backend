import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal, ProposalStatus } from './entities/proposal.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { EnhanceProposalDto } from './dto/enhance-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>,
  ) {}

  async create(createProposalDto: CreateProposalDto, userId: string): Promise<Proposal> {
    const proposal = this.proposalsRepository.create({
      ...createProposalDto,
      userId,
    });

    return this.proposalsRepository.save(proposal);
  }

  async findAll(userId: string): Promise<Proposal[]> {
    return this.proposalsRepository.find({
      where: { userId },
      relations: ['user', 'profile'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Proposal> {
    const proposal = await this.proposalsRepository.findOne({
      where: { id },
      relations: ['user', 'profile'],
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.userId !== userId) {
      throw new ForbiddenException('You can only access your own proposals');
    }

    return proposal;
  }

  async update(id: string, updateProposalDto: UpdateProposalDto, userId: string): Promise<Proposal> {
    const proposal = await this.findOne(id, userId);
    
    Object.assign(proposal, updateProposalDto);
    return this.proposalsRepository.save(proposal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const proposal = await this.findOne(id, userId);
    await this.proposalsRepository.remove(proposal);
  }

  async enhance(id: string, enhanceProposalDto: EnhanceProposalDto, userId: string): Promise<Proposal> {
    const proposal = await this.findOne(id, userId);
    
    // Here you would integrate with AI service to enhance the proposal
    // For now, we'll just update the status and add metadata
    proposal.status = ProposalStatus.ENHANCED;
    proposal.metadata = {
      ...proposal.metadata,
      enhancedAt: new Date().toISOString(),
      enhancementInstructions: enhanceProposalDto.instructions,
      tone: enhanceProposalDto.tone,
      focus: enhanceProposalDto.focus,
    };

    // TODO: Integrate with AI service to actually enhance the content
    // proposal.content = await this.aiService.enhanceProposal(proposal.content, enhanceProposalDto);

    return this.proposalsRepository.save(proposal);
  }

  async findByProfile(profileId: string, userId: string): Promise<Proposal[]> {
    return this.proposalsRepository.find({
      where: { profileId, userId },
      relations: ['user', 'profile'],
      order: { createdAt: 'DESC' },
    });
  }
} 