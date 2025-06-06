import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../infrastructures/database/transaction.dto';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
