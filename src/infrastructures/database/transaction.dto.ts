// src/modules/transactions/domain/transaction.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { TransactionSchema } from '../../domain/entities/transaction.schema';

@Entity('transactions')
export class Transaction implements TransactionSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column({ type: 'enum', enum: ['Apartment', 'House', 'Land'] })
  typeOfProperty: 'Apartment' | 'House' | 'Land';

  @Column('float')
  area: number;

  @Column('date')
  transactionDate: Date;

  @Column('float')
  transactionNetValue: number;

  @Column('float')
  transactionCost: number;

  @CreateDateColumn()
  createdAt: Date;
}
