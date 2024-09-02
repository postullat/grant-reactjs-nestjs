import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GrantsService } from '../service/grants.service';
import { Grant } from '../model/grant.model';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => Grant)
export class GrantsResolver {
  constructor(private readonly grantsService: GrantsService) {}

  @Query(() => [Grant])
  async getAllGrants() {
    return this.grantsService.findAll();
  }

  @Query(() => [Grant])
  async getAllNewMatches() {
    return this.grantsService.findAllNewMatches();
  }

  @Mutation(() => Grant)
  async updateGrantStatus(
    @Args('id') id: string,
    @Args('status') status: string,
    @Args('feedback') feedback: string,
  ) {
    // Validate inputs
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'ID cannot be null or empty and must be a string',
      );
    }
    if (!status || typeof status !== 'string') {
      throw new BadRequestException(
        'Status cannot be null or empty and must be a string',
      );
    }
    if (
      feedback === null ||
      feedback === undefined ||
      typeof feedback !== 'string'
    ) {
      throw new BadRequestException(
        'Feedback cannot be null or empty and must be a string',
      );
    }

    return this.grantsService.updateStatus(id, status, feedback);
  }
}
