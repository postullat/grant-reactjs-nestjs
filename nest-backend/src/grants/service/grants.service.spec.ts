import { Test, TestingModule } from '@nestjs/testing';
import { GrantsService } from './grants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grant, GrantDocument } from '../grant.schema';
import { BadRequestException } from '@nestjs/common';

// Create a mock Mongoose Model
const mockModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
  exec: jest.fn(),
});

describe('GrantsService', () => {
  let service: GrantsService;
  let newMatchesModel: Model<GrantDocument>;
  let allGrantsModel: Model<GrantDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantsService,
        {
          provide: getModelToken('newGrants'),
          useFactory: mockModel,
        },
        {
          provide: getModelToken('allGrants'),
          useFactory: mockModel,
        },
      ],
    }).compile();

    service = module.get<GrantsService>(GrantsService);
    newMatchesModel = module.get<Model<GrantDocument>>(
      getModelToken('newGrants'),
    );
    allGrantsModel = module.get<Model<GrantDocument>>(
      getModelToken('allGrants'),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateStatus', () => {
    // Positive test cases
    it('should update the grant status successfully', async () => {
      const mockGrant = {
        _id: '1',
        status: 'applied',
        feedback: '',
        toObject: jest.fn().mockReturnValue({
          _id: '1',
          status: 'accepted',
          feedback: 'Feedback',
        }), // Return a plain object
      } as any;

      jest.spyOn(newMatchesModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGrant),
      } as any);

      jest.spyOn(allGrantsModel, 'create').mockResolvedValue(mockGrant); // Adjust this line

      jest.spyOn(newMatchesModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGrant),
      } as any);

      const result = await service.updateStatus('1', 'accepted', 'Feedback');

      expect(newMatchesModel.findById).toHaveBeenCalledWith('1');
      expect(allGrantsModel.create).toHaveBeenCalledWith(expect.any(Object)); // Adjust this line
      expect(newMatchesModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockGrant);
    });

    // Negative test cases
    it('should throw BadRequestException if id is empty', async () => {
      await expect(
        service.updateStatus('', 'accepted', 'Feedback'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if status is invalid', async () => {
      await expect(
        service.updateStatus('1', 'invalidStatus', 'Feedback'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if feedback is too long', async () => {
      const longFeedback = 'a'.repeat(1001);
      await expect(
        service.updateStatus('1', 'accepted', longFeedback),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return null if grant is not found', async () => {
      jest.spyOn(newMatchesModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await service.updateStatus('1', 'accepted', 'Feedback');
      expect(result).toBeNull();
    });

    it('should throw an error if saving to allGrants collection fails', async () => {
      const mockGrant = {
        _id: '1',
        status: 'applied',
        feedback: '',
        toObject: jest.fn().mockReturnValue({
          _id: '1',
          status: 'accepted',
          feedback: 'Feedback',
        }),
      } as any;

      jest.spyOn(newMatchesModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGrant),
      } as any);
      jest
        .spyOn(allGrantsModel, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.updateStatus('1', 'accepted', 'Feedback'),
      ).rejects.toThrow('Database error');
    });

    it('should throw an error if deleting from newMatches collection fails', async () => {
      const mockGrant = {
        _id: '1',
        status: 'applied',
        feedback: '',
        toObject: jest.fn().mockReturnValue({
          _id: '1',
          status: 'accepted',
          feedback: 'Feedback',
        }),
      } as any;

      jest.spyOn(newMatchesModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGrant),
      } as any);
      jest.spyOn(allGrantsModel, 'create').mockResolvedValue(mockGrant);
      jest.spyOn(newMatchesModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Deletion error')),
      } as any);

      await expect(
        service.updateStatus('1', 'accepted', 'Feedback'),
      ).rejects.toThrow('Deletion error');
    });
  });

  describe('findAllNewMatches', () => {
    it('should return all new matches', async () => {
      const mockGrants = [{ _id: '1', status: 'applied' }];
      jest.spyOn(newMatchesModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGrants),
      } as any);

      const result = await service.findAllNewMatches();
      expect(result).toEqual(mockGrants);
      expect(newMatchesModel.find).toHaveBeenCalled();
    });

    it('should throw an error if fetching new matches fails', async () => {
      jest.spyOn(newMatchesModel, 'find').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Fetch error')),
      } as any);

      await expect(service.findAllNewMatches()).rejects.toThrow('Fetch error');
    });
  });

  describe('findAll', () => {
    it('should return all grants', async () => {
      const mockGrants = [{ _id: '1', status: 'accepted' }];
      jest.spyOn(allGrantsModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGrants),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(mockGrants);
      expect(allGrantsModel.find).toHaveBeenCalled();
    });

    it('should throw an error if fetching all grants fails', async () => {
      jest.spyOn(allGrantsModel, 'find').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Fetch error')),
      } as any);

      await expect(service.findAll()).rejects.toThrow('Fetch error');
    });
  });
});
