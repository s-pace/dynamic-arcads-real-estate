import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get top 5 transactions with highest margins' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the top 5 real estate transactions with the highest profit margins',
  })
  @Get('highest-margin')
  async getHighestMarginTransactions() {
    return this.reportsService.getTop5HighestMarginTransactions();
  }

  @ApiOperation({ summary: 'Get weekly average margin statistics' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the average profit margin calculated on a weekly basis',
  })
  @Get('weekly-average-margin')
  async getWeeklyAverageMargin() {
    return this.reportsService.getWeeklyAverageMargin();
  }

  @ApiOperation({ summary: 'Get city performance metrics' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the top performing cities based on transaction values',
  })
  @Get('city-performance')
  async getCityPerformance() {
    return this.reportsService.getTopCitiesByTransactionValue();
  }
}
