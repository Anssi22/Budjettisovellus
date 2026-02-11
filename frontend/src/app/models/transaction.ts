export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id?: string;
  title: string;
  amountCents: number;   // integer
  type: 'income' | 'expense';
  date: string;
}
