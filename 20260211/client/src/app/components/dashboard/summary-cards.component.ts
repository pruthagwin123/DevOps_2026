import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Summary } from '../../services/finance.service';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'summary-cards.template.html',
  styleUrl: 'summary-cards.style.css'
})
export class SummaryCardsComponent {
  @Input() summary: Summary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    expenseByCategory: {},
    insights: []
  };

  get items() {
    return [
      { label: 'Total Income', value: this.summary.totalIncome, highlight: false },
      { label: 'Total Expenses', value: this.summary.totalExpenses, highlight: false },
      { label: 'Remaining Balance', value: this.summary.balance, highlight: true }
    ];
  }
}
