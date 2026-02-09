export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;        // frontin oma id (backendissä myöhemmin _id)
  title: string;
  amount: number;
  type: TransactionType;
  date: string;      // 'YYYY-MM-DD'
}
