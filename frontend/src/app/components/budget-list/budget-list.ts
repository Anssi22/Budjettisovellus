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

  delete(id: string) {
    this.deleteRequested.emit(id);
  }
}
