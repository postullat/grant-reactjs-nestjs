import { Module } from '@nestjs/common';
import { GrantsService } from './service/grants.service';
import { GrantsResolver } from './resolver/grants.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Grant, GrantSchema } from './grant.schema';
import { SeedService } from '../seed/seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'newGrants',
        schema: GrantSchema,
        collection: 'newOpportunities',
      },
      {
        name: 'allGrants',
        schema: GrantSchema,
        collection: 'allGrantOpportunities',
      },
    ]),
  ],
  providers: [GrantsService, GrantsResolver, SeedService],
})
export class GrantsModule {}
