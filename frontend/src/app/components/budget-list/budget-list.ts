import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-list.html',
  styleUrl: './budget-list.css',
  
})

export class BudgetListComponent {
  @Input() transactions: Transaction[] = [];

  @Output() deleteRequested = new EventEmitter<string>();
  @Output() editRequested = new EventEmitter<Transaction>();

  private fmtSigned = new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: 'exceptZero',
  });

  signedEur(t: Transaction): string {
    const euros = t.amountCents / 100;
    const signed = t.type === 'expense' ? -euros : euros;
    return this.fmtSigned.format(signed);
  }

  delete(id: string) {
    this.deleteRequested.emit(id);
  }

  edit(tx: Transaction) {
    this.editRequested.emit(tx);
  }
}

