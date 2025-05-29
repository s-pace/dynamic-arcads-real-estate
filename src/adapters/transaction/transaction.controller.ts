// src/modules/transactions/interfaces/transaction.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '../../infrastructures/database/transaction.dto';
import { TransactionSchema } from '../../domain/entities/transaction.schema';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({
    description: 'Transaction data',
    examples: {
      apartment: {
        summary: 'New Apartment Transaction',
        value: {
          city: 'Paris',
          typeOfProperty: 'Apartment',
          area: 75.5,
          transactionDate: '2024-03-20',
          transactionNetValue: 450000,
          transactionCost: 420000,
        },
      },
      house: {
        summary: 'New House Transaction',
        value: {
          city: 'Lyon',
          typeOfProperty: 'House',
          area: 150,
          transactionDate: '2024-03-21',
          transactionNetValue: 750000,
          transactionCost: 680000,
        },
      },
      land: {
        summary: 'New Land Transaction',
        value: {
          city: 'Bordeaux',
          typeOfProperty: 'Land',
          area: 500,
          transactionDate: '2024-03-22',
          transactionNetValue: 300000,
          transactionCost: 280000,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    type: Transaction,
    content: {
      'application/json': {
        example: {
          id: 1,
          city: 'Paris',
          typeOfProperty: 'Apartment',
          area: 75.5,
          transactionDate: '2024-03-20T00:00:00.000Z',
          transactionNetValue: 450000,
          transactionCost: 420000,
          createdAt: '2024-03-20T14:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid transaction data provided.',
    content: {
      'application/json': {
        examples: {
          invalidCity: {
            summary: 'Invalid City',
            value: {
              message: 'Validation failed',
              error: {
                city: ['City is required'],
              },
            },
          },
          invalidAmount: {
            summary: 'Invalid Amount',
            value: {
              message: 'Validation failed',
              error: {
                transactionNetValue: [
                  'Transaction net value must be a positive number',
                ],
              },
            },
          },
        },
      },
    },
  })
  @Post()
  async create(
    @Body(new ZodValidationPipe(TransactionSchema))
    body: TransactionSchema,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(body);
  }

  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all transactions.',
    type: [Transaction],
    content: {
      'application/json': {
        example: [
          {
            id: 1,
            city: 'Paris',
            typeOfProperty: 'Apartment',
            area: 75.5,
            transactionDate: '2024-03-20T00:00:00.000Z',
            transactionNetValue: 450000,
            transactionCost: 420000,
            createdAt: '2024-03-20T14:30:00.000Z',
          },
          {
            id: 2,
            city: 'Lyon',
            typeOfProperty: 'House',
            area: 150,
            transactionDate: '2024-03-21T00:00:00.000Z',
            transactionNetValue: 750000,
            transactionCost: 680000,
            createdAt: '2024-03-21T09:15:00.000Z',
          },
        ],
      },
    },
  })
  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }
}
