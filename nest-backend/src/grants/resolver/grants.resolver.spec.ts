import { Test, TestingModule } from '@nestjs/testing';
import { GrantsService } from '../service/grants.service';
import { GrantsResolver } from './grants.resolver';
import { Grant } from '../model/grant.model';

describe('GrantsResolver', () => {
  let resolver: GrantsResolver;
  let service: GrantsService;

  const mockGrant: Grant = {
    id: '1',
    foundationName: 'Foundation X',
    grantName: 'Grant Y',
    description: 'A description',
    amount: 1000,
    status: 'accepted',
    deadline: new Date(),
    matchDate: new Date(),
    feedback: 'Great work',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantsResolver,
        {
          provide: GrantsService,
          useValue: {
            findAllNewMatches: jest.fn(),
            findGrants: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<GrantsResolver>(GrantsResolver);
    service = module.get<GrantsService>(GrantsService);
  });

  // Positive test cases for getAllNewMatches
  describe('getAllNewMatches', () => {
    it('should return all new matches successfully', async () => {
      const mockNewMatches: Grant[] = [
        { ...mockGrant, id: '3' },
        { ...mockGrant, id: '4' },
      ];
      jest
        .spyOn(service, 'findAllNewMatches')
        .mockResolvedValue(mockNewMatches);

      const result = await resolver.getAllNewMatches();
      expect(result).toEqual(mockNewMatches);
      expect(service.findAllNewMatches).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateGrantStatus', () => {
    it('should update grant status successfully with valid arguments', async () => {
      const updatedGrant = {
        ...mockGrant,
        status: 'accepted',
        feedback: 'Good job',
      };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(updatedGrant);

      const result = await resolver.updateGrantStatus(
        '1',
        'accepted',
        'Good job',
      );

      expect(service.updateStatus).toHaveBeenCalledWith(
        '1',
        'accepted',
        'Good job',
      );
      expect(result).toEqual(updatedGrant);
    });

    it('should update the status from "applied" to "accepted"', async () => {
      const updatedGrant = { ...mockGrant, status: 'accepted', feedback: '' };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(updatedGrant);

      const result = await resolver.updateGrantStatus('1', 'accepted', '');

      expect(service.updateStatus).toHaveBeenCalledWith('1', 'accepted', '');
      expect(result).toEqual(updatedGrant);
    });

    it('should update both status and feedback correctly', async () => {
      const updatedGrant = {
        ...mockGrant,
        status: 'accepted',
        feedback: 'Reviewed',
      };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(updatedGrant);

      const result = await resolver.updateGrantStatus(
        '1',
        'accepted',
        'Reviewed',
      );

      expect(service.updateStatus).toHaveBeenCalledWith(
        '1',
        'accepted',
        'Reviewed',
      );
      expect(result).toEqual(updatedGrant);
    });

    it('should handle small feedback input correctly', async () => {
      const updatedGrant = { ...mockGrant, status: 'accepted', feedback: 'OK' };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(updatedGrant);

      const result = await resolver.updateGrantStatus('1', 'accepted', 'OK');

      expect(service.updateStatus).toHaveBeenCalledWith('1', 'accepted', 'OK');
      expect(result).toEqual(updatedGrant);
    });

    it('should be idempotent when called with the same values multiple times', async () => {
      const updatedGrant = {
        ...mockGrant,
        status: 'accepted',
        feedback: 'Reviewed',
      };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(updatedGrant);

      await resolver.updateGrantStatus('1', 'accepted', 'Reviewed');
      const result = await resolver.updateGrantStatus(
        '1',
        'accepted',
        'Reviewed',
      );

      expect(service.updateStatus).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedGrant);
    });

    it('should handle invalid id', async () => {
      jest
        .spyOn(service, 'updateStatus')
        .mockRejectedValue(new Error('ID cannot be null or empty'));

      await expect(
        resolver.updateGrantStatus('', 'accepted', 'Feedback'),
      ).rejects.toThrow('ID cannot be null or empty');
    });

    it('should handle invalid status value', async () => {
      jest
        .spyOn(service, 'updateStatus')
        .mockRejectedValue(new Error('Invalid status'));

      await expect(
        resolver.updateGrantStatus('1', 'not_supported', 'Feedback'),
      ).rejects.toThrow('Invalid status');
    });

    it('should handle empty feedback', async () => {
      const updatedGrant = { ...mockGrant, status: 'accepted', feedback: '' };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(updatedGrant);

      const result = await resolver.updateGrantStatus('1', 'accepted', '');

      expect(service.updateStatus).toHaveBeenCalledWith('1', 'accepted', '');
      expect(result).toEqual(updatedGrant);
    });

    it('should handle the service throwing an exception', async () => {
      jest.spyOn(service, 'updateStatus').mockImplementation(() => {
        throw new Error('Service error');
      });

      await expect(
        resolver.updateGrantStatus('1', 'accepted', 'Feedback'),
      ).rejects.toThrow('Service error');
    });

    it('should handle a database write error', async () => {
      jest
        .spyOn(service, 'updateStatus')
        .mockRejectedValue(new Error('Database write error'));

      await expect(
        resolver.updateGrantStatus('1', 'accepted', 'Feedback'),
      ).rejects.toThrow('Database write error');
    });

    it('should handle null arguments', async () => {
      await expect(
        resolver.updateGrantStatus(null, 'applied', 'Feedback'),
      ).rejects.toThrow();
      await expect(
        resolver.updateGrantStatus('1', null, 'Feedback'),
      ).rejects.toThrow();
      await expect(
        resolver.updateGrantStatus('1', 'accepted', null),
      ).rejects.toThrow();
    });
  });
});
