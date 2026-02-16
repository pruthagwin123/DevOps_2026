import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expenseByCategory: Record<string, number>;
  insights: string[];
}

export interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiBase = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<{ summary: Summary }> {
    return this.http.get<{ summary: Summary }>(`${this.apiBase}/summary`, {
      withCredentials: true
    });
  }

  getTransactions(filters?: any): Observable<{ transactions: Transaction[] }> {
    const params = this.buildParams(filters);
    return this.http.get<{ transactions: Transaction[] }>(
      `${this.apiBase}/transactions${params}`,
      { withCredentials: true }
    );
  }

  addIncome(amount: number, category: string, description: string): Observable<{ summary: Summary }> {
    return this.http.post<{ summary: Summary }>(
      `${this.apiBase}/income`,
      { amount, category, description },
      { withCredentials: true }
    );
  }

  addExpense(amount: number, category: string, description: string): Observable<{ summary: Summary }> {
    return this.http.post<{ summary: Summary }>(
      `${this.apiBase}/expense`,
      { amount, category, description },
      { withCredentials: true }
    );
  }

  private buildParams(filters?: any): string {
    if (!filters) return '';
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]: [string, any]) => {
      if (value && value !== 'all') {
        params.set(key, String(value));
      }
    });
    const query = params.toString();
    return query ? `?${query}` : '';
  }
}
