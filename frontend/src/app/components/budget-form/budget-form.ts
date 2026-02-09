import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetFormComponent {
  private fb = inject(FormBuilder);

  @Output() created = new EventEmitter<Transaction>();

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    type: ['expense', [Validators.required]],
    date: [new Date().toISOString().slice(0, 10), [Validators.required]],
  });

  submit() {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.created.emit({
      id: crypto.randomUUID(),
      title: v.title!,
      amount: Number(v.amount),
      type: v.type as any,
      date: v.date!,
    });

    this.form.patchValue({ title: '', amount: 0, type: 'expense' });
  }
}
