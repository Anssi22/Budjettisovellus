import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { BudgetListComponent } from './components/budget-list/budget-list';
import { SummaryComponent } from './components/summary/summary';
import { BudgetFormComponent } from './components/budget-form/budget-form';

import { Transaction } from './models/transaction';
import { BudgetService } from './services/budget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SummaryComponent, BudgetListComponent, BudgetFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  transactions: Transaction[] = [];
  editing: Transaction | null = null;

  constructor(private budget: BudgetService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.budget.getAll().subscribe((list: Transaction[]) => {
      console.log('transactions from API:', list);
      this.transactions = list;
    });
  }

  startEdit(tx: Transaction): void {
    this.editing = tx;
  }

  save(tx: Transaction): void {
    const req$ = this.editing ? this.budget.update(tx) : this.budget.add(tx);

    req$.subscribe(() => {
      this.editing = null;
      this.reload();
    });
  }

  remove(id: string): void {
    this.budget.remove(id).subscribe(() => this.reload());
  }

  cancelEdit(): void {
    this.editing = null;
  }
}
