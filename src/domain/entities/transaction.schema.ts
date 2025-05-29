import { z } from 'zod';

export const TransactionSchema = z.object({
  city: z.string().min(1),
  typeOfProperty: z.enum(['Apartment', 'House', 'Land']),
  area: z.number().positive(),
  transactionDate: z.coerce.date(),
  transactionNetValue: z.number().positive(),
  transactionCost: z.number().positive(),
});

export type TransactionSchema = z.infer<typeof TransactionSchema>;
