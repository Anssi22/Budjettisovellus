import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetFormComponent implements OnChanges {
  @Input() editing: Transaction | null = null;

  @Output() created = new EventEmitter<Transaction>();
  @Output() cancelRequested = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  // amount = euroina UI:ssa
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    amount: [0, [Validators.required, Validators.min(0.01)]], // eurot
    type: ['expense', [Validators.required]],
    date: [new Date().toISOString().slice(0, 10), [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editing'] && this.editing) {
      this.form.patchValue({
        title: this.editing.title,
        amount: this.editing.amountCents / 100, // <- sentit -> eurot
        type: this.editing.type,
        date: this.editing.date,
      });
    }

    if (changes['editing'] && !this.editing) {
      this.resetFormToDefaults();
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    const euros = Number(v.amount);
    const amountCents = Math.round(euros * 100); // <- eurot -> sentit (pyöristys) [web:554]

    const tx: Transaction = {
      _id: this.editing?._id,
      title: v.title!,
      amountCents,
      type: v.type as any,
      date: v.date!,
    };

    this.created.emit(tx);
    this.resetFormToDefaults();
  }

  cancel(): void {
    this.cancelRequested.emit();
    this.resetFormToDefaults();
  }

  private resetFormToDefaults(): void {
    this.form.patchValue({
      title: '',
      amount: 0, // euroina
      type: 'expense',
      date: new Date().toISOString().slice(0, 10),
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
