import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FinanceService, Summary, Transaction } from '../../services/finance.service';
import { ToastService } from '../../services/toast.service';
import { SummaryCardsComponent } from './summary-cards.component';
import { TransactionHistoryComponent } from './transaction-history.component';
import { EntryFormComponent } from './entry-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SummaryCardsComponent,
    TransactionHistoryComponent,
    EntryFormComponent
  ],
  template: `
    <div class="page">
      <header class="topbar">
        <div>
          <p class="eyebrow">Personal Finance Tracker</p>
          <h1>Know your money story in one glance.</h1>
          <p class="subtitle">Track income, expenses, and balance in real time.</p>
        </div>
        <div class="nav-actions">
          <button
            [class.active]="view === 'dashboard'"
            (click)="view = 'dashboard'"
          >
            Dashboard
          </button>
          <button
            [class.active]="view === 'transactions'"
            (click)="view = 'transactions'"
          >
            Transactions
          </button>
          <button class="ghost" (click)="authService.toggleTheme()" aria-label="Toggle dark mode">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <button class="ghost" (click)="authService.logout()">Logout</button>
        </div>
      </header>

      @if (summary.balance < 0) {
        <div class="warning">Warning: Your balance is negative.</div>
      }

      @if (error) {
        <div class="error">{{ error }}</div>
      }

      @if (view === 'dashboard') {
        <main class="content">
          <section class="hero-panel">
            <app-summary-cards [summary]="summary"></app-summary-cards>
            <div class="quick-actions">
              <button class="primary" (click)="jumpToForm('income-form')">Add Income</button>
              <button class="secondary" (click)="jumpToForm('expense-form')">Add Expense</button>
              <button class="ghost" (click)="view = 'transactions'">View Transactions</button>
            </div>
          </section>

          <section class="forms">
            <app-entry-form
              id="income-form"
              type="income"
              [categories]="['Salary']"
              (onSubmit)="handleIncome($event)"
            ></app-entry-form>
            <app-entry-form
              id="expense-form"
              type="expense"
              [categories]="expenseCategories"
              (onSubmit)="handleExpense($event)"
            ></app-entry-form>
          </section>
        </main>
      }

      @if (view === 'transactions') {
        <main class="content">
          <app-transaction-history
            [transactions]="transactions"
            [categories]="allCategories"
            [filters]="filters"
            (onFilterChange)="onFiltersChange($event)"
          ></app-transaction-history>
        </main>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 24px 48px;
    }

    .topbar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
      align-items: center;
    }

    .nav-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .forms {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      margin-top: 24px;
    }

    .content {
      display: grid;
      gap: 24px;
      margin-top: 32px;
      animation: fadeIn 240ms ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  view = 'dashboard';
  summary: Summary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    expenseByCategory: { Food: 0, Travel: 0, Rent: 0, Shopping: 0 },
    insights: []
  };
  transactions: Transaction[] = [];
  error = '';
  isDark = (document.documentElement.dataset as any)['theme'] === 'dark';
  filters = { type: 'all', category: 'all', month: '', search: '' };
  
  expenseCategories = ['Food', 'Travel', 'Rent', 'Shopping'];
  allCategories = ['Food', 'Travel', 'Rent', 'Shopping', 'Salary'];

  constructor(
    public authService: AuthService,
    private financeService: FinanceService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadTransactions();
  }

  loadSummary(): void {
    this.financeService.getSummary().subscribe({
      next: (result) => {
        this.summary = result.summary;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load summary.';
      }
    });
  }

  loadTransactions(): void {
    this.financeService.getTransactions(this.filters).subscribe({
      next: (result) => {
        this.transactions = result.transactions || [];
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load transactions.';
      }
    });
  }

  jumpToForm(id: string): void {
    this.view = 'dashboard';
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  handleIncome(payload: any): void {
    this.financeService.addIncome(payload.amount, payload.category, payload.description).subscribe({
      next: () => {
        this.toastService.show('Income added successfully!', 'success');
        this.loadSummary();
        this.loadTransactions();
      },
      error: (err) => {
        this.toastService.show(err.error?.error || 'Failed to add income.', 'error');
      }
    });
  }

  handleExpense(payload: any): void {
    this.financeService.addExpense(payload.amount, payload.category, payload.description).subscribe({
      next: () => {
        this.toastService.show('Expense added successfully!', 'success');
        this.loadSummary();
        this.loadTransactions();
      },
      error: (err) => {
        this.toastService.show(err.error?.error || 'Failed to add expense.', 'error');
      }
    });
  }

  onFiltersChange(newFilters: any): void {
    this.filters = newFilters;
    this.loadTransactions();
  }
}
