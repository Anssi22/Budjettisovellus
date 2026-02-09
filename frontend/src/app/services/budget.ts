import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  // TODO (backend): korvaa nämä HTTP-kutsuilla Express API:in (GET/POST/PUT/DELETE /api/transactions)
  // TODO (backend): kun MongoDB käytössä, Transaction saa id:n backendiltä (esim. _id)

  private transactions: Transaction[] = [
    { id: '1', title: 'Palkka', amount: 2200, type: 'income', date: '2026-02-01' },
    { id: '2', title: 'Vuokra', amount: 750, type: 'expense', date: '2026-02-02' },
  ];

  getAll(): Transaction[] {
    return this.transactions;
  }

  add(tx: Transaction): void {
    this.transactions = [tx, ...this.transactions];
  }

  remove(id: string): void {
    this.transactions = this.transactions.filter(t => t.id !== id);
  }
}
