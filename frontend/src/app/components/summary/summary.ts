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

  get incomeTotal() {
    return this.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  }
  get expenseTotal() {
    return this.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  }
  get balance() {
    return this.incomeTotal - this.expenseTotal;
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.createChart();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Input voi muuttua ennen kuin canvas on olemassa → odota viewReady
    if (!this.viewReady) return;

    // Jos chart on jo luotu, vain päivitä data
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
        datasets: [{ data: [0, 0] }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data.datasets[0].data = [this.incomeTotal, this.expenseTotal];
    this.chart.update(); // päivitä Chart.js [web:247]
  }
}
