export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id?: string;      // backend (Mongo)
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
}
