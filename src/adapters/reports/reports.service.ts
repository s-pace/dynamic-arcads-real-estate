import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from '../../infrastructures/database/transaction.dto';
import { subDays } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async getTop5HighestMarginTransactions() {
    return await this.transactionRepo
      .createQueryBuilder('t')
      .select([
        't.*',
        '(t.transactionNetValue - t.transactionCost) as profitMargin',
      ])
      .orderBy('profitMargin', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getWeeklyAverageMargin() {
    const today = new Date();
    const lastWeekStart = subDays(today, 7);
    const previousWeekStart = subDays(lastWeekStart, 7);

    const [currentWeekData, previousWeekData] = await Promise.all([
      this.calculateAverageMargin(lastWeekStart, today),
      this.calculateAverageMargin(previousWeekStart, lastWeekStart),
    ]);

    const percentageChange =
      previousWeekData.average !== 0
        ? ((currentWeekData.average - previousWeekData.average) /
            previousWeekData.average) *
          100
        : 0;

    return {
      currentWeekAverage: currentWeekData.average,
      previousWeekAverage: previousWeekData.average,
      percentageChange,
    };
  }

  private async calculateAverageMargin(startDate: Date, endDate: Date) {
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .select('AVG(t.transactionNetValue - t.transactionCost)', 'average')
      .where('t.transactionDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return { average: result.average || 0 };
  }

  async getTopCitiesByTransactionValue() {
    return await this.transactionRepo
      .createQueryBuilder('t')
      .select([
        't.city',
        'AVG(t.transactionNetValue) as averageValue',
        'COUNT(t.id) as transactionCount',
      ])
      .groupBy('t.city')
      .orderBy('averageValue', 'DESC')
      .limit(5)
      .getRawMany();
  }
}
