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

  // ReactiveFormsModule -> jotta [formGroup] ja formControlName toimii template:ssa
  // CommonModule -> jotta *ngIf toimii template:ssa (Peru-nappi näkyy vain edit-tilassa)
  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetFormComponent implements OnChanges {
  // INPUT parentilta (App): jos tämä ei ole null, ollaan "edit moodissa"
  // Parent antaa tähän sen Transaction-olion jota halutaan muokata
  @Input() editing: Transaction | null = null;

  // OUTPUT parentille: kun käyttäjä painaa "Lisää" tai "Tallenna"
  // Lähetetään parentille Transaction-olio (uusi tai päivitetty)
  @Output() created = new EventEmitter<Transaction>();

  // OUTPUT parentille: kun käyttäjä painaa "Peru" edit-tilassa
  @Output() cancelRequested = new EventEmitter<void>();

  // FormBuilder on apuluokka lomakkeen tekemiseen (Reactive Forms)
  private fb = inject(FormBuilder);

  // Tämä on itse lomakeobjekti
  // Huom: date on "YYYY-MM-DD" -muodossa koska input type="date" tykkää siitä
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    type: ['expense', [Validators.required]],
    date: [new Date().toISOString().slice(0, 10), [Validators.required]],
  });

  // Angular kutsuu tämän aina kun @Input()-arvo muuttuu
  // Me käytetään tätä siihen, että kun parent valitsee "muokattavan" tapahtuman,
  // lomake täytetään sen tiedoilla.
  ngOnChanges(changes: SimpleChanges): void {
    // Jos editing muuttui ja se EI ole null -> täytä lomake
    if (changes['editing'] && this.editing) {
      this.form.patchValue({
        title: this.editing.title,
        amount: this.editing.amount,
        type: this.editing.type,
        date: this.editing.date,
      });
    }

    // Jos editing muuttui ja nyt se on null -> tyhjennä lomake takaisin "lisäys"-tilaan
    if (changes['editing'] && !this.editing) {
      this.resetFormToDefaults();
    }
  }

  // Tämä kutsutaan kun formi submitataan (ngSubmit)
  submit(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    // Rakennetaan Transaction-olio
    // - Jos muokataan (editing != null), pidetään sama id
    // - Jos lisätään uusi, generoidaan uusi id
    const tx: Transaction = {
      _id: this.editing?._id,
      title: v.title!,
      amount: Number(v.amount),
      type: v.type as any,
      date: v.date!,
    };

    // Lähetetään parentille (App) tieto: "tallenna tämä"
    this.created.emit(tx);

    // Muokkauksen jälkeen parent tyypillisesti nollaa edit-tilan,
    // mutta me voidaan myös varmistaa että formi palaa oletukseen
    this.resetFormToDefaults();
  }

  // Tämä on "Peru" -nappia varten edit-moodissa
  cancel(): void {
    // Kerrotaan parentille että muokkaus peruttiin
    this.cancelRequested.emit();

    // Tyhjennetään myös oma lomake
    this.resetFormToDefaults();
  }

  // Pieni apumetodi: palauttaa formiin oletusarvot
  private resetFormToDefaults(): void {
    this.form.patchValue({
      title: '',
      amount: 0,
      type: 'expense',
      date: new Date().toISOString().slice(0, 10),
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
