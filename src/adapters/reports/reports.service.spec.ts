import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportsService } from './reports.service';
import { Transaction } from '../../infrastructures/database/transaction.dto';

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: Repository<Transaction>;

  const mockTransactions = [
    {
      id: 1,
      city: 'Paris',
      typeOfProperty: 'Apartment',
      area: 75,
      transactionDate: new Date('2024-03-15'),
      transactionNetValue: 500000,
      transactionCost: 450000,
      createdAt: new Date(),
    },
    {
      id: 2,
      city: 'Lyon',
      typeOfProperty: 'House',
      area: 120,
      transactionDate: new Date('2024-03-14'),
      transactionNetValue: 600000,
      transactionCost: 520000,
      createdAt: new Date(),
    },
    {
      id: 3,
      city: 'Paris',
      typeOfProperty: 'Apartment',
      area: 60,
      transactionDate: new Date('2024-03-10'),
      transactionNetValue: 400000,
      transactionCost: 350000,
      createdAt: new Date(),
    },
  ];

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
            find: jest.fn().mockResolvedValue(mockTransactions),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTop5HighestMarginTransactions', () => {
    it('should return top 5 transactions with highest margins', async () => {
      const mockResult = [
        {
          ...mockTransactions[1],
          profitMargin: 80000,
        },
        {
          ...mockTransactions[0],
          profitMargin: 50000,
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValueOnce(mockResult);

      const result = await service.getTop5HighestMarginTransactions();

      expect(result).toEqual(mockResult);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        't.*',
        '(t.transactionNetValue - t.transactionCost) as profitMargin',
      ]);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'profitMargin',
        'DESC',
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('getWeeklyAverageMargin', () => {
    it('should calculate weekly average margins and percentage change', async () => {
      const mockCurrentWeekAverage = { average: 65000 };
      const mockPreviousWeekAverage = { average: 50000 };

      mockQueryBuilder.getRawOne
        .mockResolvedValueOnce(mockCurrentWeekAverage)
        .mockResolvedValueOnce(mockPreviousWeekAverage);

      const result = await service.getWeeklyAverageMargin();

      expect(result).toEqual({
        currentWeekAverage: 65000,
        previousWeekAverage: 50000,
        percentageChange: 30, // (65000 - 50000) / 50000 * 100
      });
    });

    it('should handle zero previous week average', async () => {
      mockQueryBuilder.getRawOne
        .mockResolvedValueOnce({ average: 65000 })
        .mockResolvedValueOnce({ average: 0 });

      const result = await service.getWeeklyAverageMargin();

      expect(result).toEqual({
        currentWeekAverage: 65000,
        previousWeekAverage: 0,
        percentageChange: 0,
      });
    });
  });

  describe('getTopCitiesByTransactionValue', () => {
    it('should return top 5 cities by average transaction value', async () => {
      const mockCityResults = [
        {
          city: 'Paris',
          averageValue: 450000,
          transactionCount: '2',
        },
        {
          city: 'Lyon',
          averageValue: 600000,
          transactionCount: '1',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValueOnce(mockCityResults);

      const result = await service.getTopCitiesByTransactionValue();

      expect(result).toEqual(mockCityResults);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        't.city',
        'AVG(t.transactionNetValue) as averageValue',
        'COUNT(t.id) as transactionCount',
      ]);
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('t.city');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'averageValue',
        'DESC',
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });
  });
});
