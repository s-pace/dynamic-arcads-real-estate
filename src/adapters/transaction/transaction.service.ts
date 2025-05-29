import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionSchema } from '../../domain/entities/transaction.schema';
import { Transaction } from '../../infrastructures/database/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async createTransaction(dto: TransactionSchema): Promise<Transaction> {
    const transaction = this.transactionRepo.create({
      ...dto,
      transactionDate: new Date(dto.transactionDate),
    });
    return await this.transactionRepo.save(transaction);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionRepo.find();
  }
}
