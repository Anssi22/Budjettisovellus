import { Component, inject } from '@angular/core';
import { BudgetFormComponent } from './components/budget-form/budget-form';
import { BudgetListComponent } from './components/budget-list/budget-list';
import { SummaryComponent } from './components/summary/summary';
import { Transaction } from './models/transaction';
import { BudgetService } from './services/budget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BudgetFormComponent, BudgetListComponent, SummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private budget = inject(BudgetService);

  transactions: Transaction[] = this.budget.getAll();

  add(tx: Transaction) {
    this.budget.add(tx);
    this.transactions = this.budget.getAll();
  }

  remove(id: string) {
    this.budget.remove(id);
    this.transactions = this.budget.getAll();
  }
}
