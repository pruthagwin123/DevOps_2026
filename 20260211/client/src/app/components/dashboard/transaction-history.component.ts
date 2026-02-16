import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../services/finance.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'transaction-history.template.html',
  styleUrl: 'transaction-history.style.css'
})
export class TransactionHistoryComponent {
  @Input() transactions: Transaction[] = [];
  @Input() categories: string[] = [];
  @Input() filters: any = { type: 'all', category: 'all', month: '', search: '' };
  @Output() onFilterChange = new EventEmitter<any>();

  getTotalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }

  getTotalExpense(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }

  getSign(tx: Transaction): string {
    return tx.type === 'income' ? '+$' : '-$';
  }

  onFieldChange(field: string, event: any) {
    this.onFilterChange.emit({ ...this.filters, [field]: event.target.value });
  }
}
