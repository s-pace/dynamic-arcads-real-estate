import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { Transaction } from '../src/infrastructures/database/transaction.dto';

describe('Reports (e2e)', () => {
  let app: INestApplication;
  let mockRepository;

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
  ];

  beforeEach(async () => {
    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockTransactions),
        getRawOne: jest.fn().mockResolvedValue({ average: 65000 }),
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Transaction))
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/reports/highest-margin (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/highest-margin')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      });
  });

  it('/reports/weekly-average-margin (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/weekly-average-margin')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('currentWeekAverage');
        expect(res.body).toHaveProperty('previousWeekAverage');
        expect(res.body).toHaveProperty('percentageChange');
      });
  });

  it('/reports/city-performance (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/city-performance')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      });
  });
});
