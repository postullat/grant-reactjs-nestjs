import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grant, GrantDocument } from '../grant.schema';

@Injectable()
export class GrantsService {
  constructor(
    @InjectModel('newGrants') private newMatchesModel: Model<GrantDocument>,
    @InjectModel('allGrants') private allGrantsModel: Model<GrantDocument>,
  ) {}

  async updateStatus(
    id: string,
    status: string,
    feedback: string,
  ): Promise<Grant | null> {
    // Validate input
    if (!id) {
      throw new BadRequestException('ID cannot be empty.');
    }

    if (!status || !['accepted', 'rejected', 'applied'].includes(status)) {
      throw new BadRequestException('Invalid status value.');
    }

    if (feedback && feedback.length > 1000) {
      throw new BadRequestException('Feedback is too long.');
    }

    // Fetch the grant from the newMatches collection
    const grant = await this.newMatchesModel.findById(id).exec();

    // Return null if no grant is found for the provided id
    if (!grant) {
      return null;
    }

    // Update the status and feedback of the fetched grant
    grant.status = status;
    grant.feedback = feedback;

    // Save the updated grant to the allGrants collection
    await this.allGrantsModel.create(grant.toObject());

    // Remove the grant from the newMatches collection
    await this.newMatchesModel.findByIdAndDelete(id).exec();

    // Return the updated grant
    return grant;
  }

  async findAllNewMatches(): Promise<Grant[]> {
    return this.newMatchesModel.find().exec();
  }

  async findAll(): Promise<Grant[]> {
    return this.allGrantsModel.find().exec();
  }
}
