import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class SummaryComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() transactions: Transaction[] = [];

  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private viewReady = false;

  // Valuuttaformaattaus: 50000 -> "500,00 €" [web:541]
  private fmt = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' });

  private fmtSigned = new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: 'exceptZero', // tai 'always' jos haluat myös +0,00 € [web:541]
  });

  eur(cents: number): string {
    return this.fmt.format(cents / 100);
  }

  eurSigned(cents: number): string {
    return this.fmtSigned.format(cents / 100);
  }


  // Totals sentteinä
  get incomeTotalCents(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amountCents, 0);
  }

  get expenseTotalCents(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amountCents, 0);
  }

  get balanceCents(): number {
    return this.incomeTotalCents - this.expenseTotalCents;
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.createChart();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewReady) return;
    this.updateChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  private createChart(): void {
    if (this.chart) return;

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Tulot', 'Menot'],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: ['#2e7d32', '#c62828'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  private updateChart(): void {
    if (!this.chart) return;

    // Chartiin eurot (helpompi lukea)
    const incomeEuros = this.incomeTotalCents / 100;
    const expenseEuros = this.expenseTotalCents / 100;

    this.chart.data.datasets[0].data = [incomeEuros, expenseEuros];
    this.chart.update(); // Chart.js update [web:569]
  }
}
