import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grant, GrantDocument } from '../grants/grant.schema'; // Use your schema

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel('newGrants') private newMatchesModel: Model<GrantDocument>,
    @InjectModel('allGrants') private allGrantsModel: Model<GrantDocument>,
  ) {}

  async onModuleInit() {
    // Check if the collection is empty
    const count = await this.newMatchesModel.estimatedDocumentCount();
    const count2 = await this.allGrantsModel.estimatedDocumentCount();

    if (count <= 1) {
      // Insert sample data
      await this.newMatchesModel.insertMany([
        {
          foundationName: 'ABC Grant',
          grantName: 'ABC Grant',
          description: 'some description',
          location: 'Wilmington, Delaware',
          amount: 5000,
          status: 'applied',
          deadline: '2024-08-29T05:11:35.000+00:00',
          matchDate: '2024-08-29T05:11:35.000+00:00',
          feedback: 'Initial feedback',
        },
        {
          foundationName: 'XYZ Foundation',
          grantName: 'XYZ Foundation',
          description: 'some description',
          location: 'Wilmington, Delaware',
          amount: 14000,
          status: 'applied',
          deadline: '2024-10-19T05:11:35.000+00:00',
          matchDate: '2024-08-25T05:11:35.000+00:00',
          feedback: 'Pending grant',
        },
        {
          foundationName: 'M foundation',
          grantName: 'M foundation',
          description: 'some description',
          location: 'Wilmington, Delaware',
          amount: 50000,
          status: 'applied',
          deadline: '2024-09-16T05:11:35.000+00:00',
          matchDate: '2024-08-29T05:11:35.000+00:00',
          feedback: 'Pending grant',
        },
        {
          foundationName: 'T foundation',
          grantName: 'T foundation',
          description: 'some description',
          location: 'Wilmington, Delaware',
          amount: 74000,
          status: 'applied',
          deadline: '2024-08-14T05:11:35.000+00:00',
          matchDate: '2024-07-29T05:11:35.000+00:00',
          feedback: 'Pending grant',
        },
      ]);
      if (count2 <= 1) {
        // Insert sample data
        await this.allGrantsModel.insertMany([
          {
            foundationName: 'Robinson Foundation Grant',
            grantName: 'Robinson Foundation Grant',
            description: 'some description',
            location: 'Wilmington, Delaware',
            amount: 5000,
            status: 'applied',
            deadline: '2024-08-29T05:11:35.000+00:00',
            matchDate: '2024-08-29T05:11:35.000+00:00',
            feedback: 'Initial feedback',
          },
          {
            foundationName: 'Looking Out',
            grantName: 'Looking Out',
            description: 'some description',
            location: 'Wilmington, Delaware',
            amount: 17000,
            status: 'accepted',
            deadline: '2024-09-09T05:11:35.000+00:00',
            matchDate: '2024-08-07T05:11:35.000+00:00',
            feedback: 'Approved grant',
          },
          {
            foundationName: 'Dribble Foundation Grant',
            grantName: 'Dribble Foundation Grant',
            description: 'some description',
            location: 'Wilmington, Delaware',
            amount: 24000,
            status: 'rejected',
            deadline: '2024-09-21T05:11:35.000+00:00',
            matchDate: '2024-08-19T05:11:35.000+00:00',
            feedback: 'Rejected grant',
          },
          {
            foundationName: 'Walki wako Foundation',
            grantName: 'Walki wako Foundation',
            description: 'some description',
            location: 'Wilmington, Delaware',
            amount: 14000,
            status: 'accepted',
            deadline: '2024-10-19T05:11:35.000+00:00',
            matchDate: '2024-08-25T05:11:35.000+00:00',
            feedback: 'Pending grant',
          },
          {
            foundationName: 'Some magic foundation',
            grantName: 'Some magic foundation',
            description: 'some description',
            location: 'Wilmington, Delaware',
            amount: 50000,
            status: 'accepted',
            deadline: '2024-09-16T05:11:35.000+00:00',
            matchDate: '2024-08-29T05:11:35.000+00:00',
            feedback: 'Pending grant',
          },
          {
            foundationName: 'Test magic foundation',
            grantName: 'Test magic foundation',
            description: 'some description',
            location: 'Wilmington, Delaware',
            amount: 74000,
            status: 'accepted',
            deadline: '2024-08-14T05:11:35.000+00:00',
            matchDate: '2024-07-29T05:11:35.000+00:00',
            feedback: 'Pending grant',
          },
        ]);
      }
      console.log('Sample data inserted into the Grant collection');
    }
  }
}
