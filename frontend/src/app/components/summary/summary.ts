import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit, OnChanges } from '@angular/core';
import { Transaction } from '../../models/transaction';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class SummaryComponent implements AfterViewInit, OnChanges {
  @Input() transactions: Transaction[] = [];

  private chart: Chart | null = null;

  get incomeTotal() {
    return this.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  }

  get expenseTotal() {
    return this.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  }

  get balance() {
    return this.incomeTotal - this.expenseTotal;
  }

  ngAfterViewInit() {
    this.createOrUpdateChart();
  }

  ngOnChanges() {
    this.createOrUpdateChart();
  }

  private createOrUpdateChart() {
    const canvasId = 'summaryChart';

    // Jos kaavio on jo olemassa, päivitetään data
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.incomeTotal, this.expenseTotal];
      this.chart.update();
      return;
    }

    // Muuten luodaan uusi
    this.chart = new Chart(canvasId, {
      type: 'doughnut',
      data: {
        labels: ['Tulot', 'Menot'],
        datasets: [
          {
            data: [this.incomeTotal, this.expenseTotal],
          },
        ],
      },
    });
  }
}
