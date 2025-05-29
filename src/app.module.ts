// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructures/database/database.module';
import { TransactionsModule } from './adapters/transaction/transaction.controller.module';
import { ReportsModule } from './adapters/reports/reports.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TransactionsModule,
    ReportsModule,
  ],
})
export class AppModule {}
