import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit_click()" class="form">
      <h3>{{ type === 'income' ? 'Add Income' : 'Add Expense' }}</h3>
      <label class="form-label">
        Amount
        <input
          type="number"
          step="0.01"
          min="0"
          [(ngModel)]="amount"
          name="amount"
          required
        />
      </label>
      @if (categories.length > 0) {
        <label class="form-label">
          Category
          <select [(ngModel)]="category" name="category">
            @for (opt of categories; track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>
        </label>
      }
      <label class="form-label">
        Description
        <input
          type="text"
          [(ngModel)]="description"
          name="description"
          placeholder="Optional notes"
        />
      </label>
      <button type="submit">Save</button>
    </form>
  `,
  styles: [`
    .form {
      background: var(--card);
      padding: 20px;
      border-radius: 16px;
      display: grid;
      gap: 12px;
      box-shadow: var(--shadow);
    }

    .form h3 {
      margin: 0 0 8px;
    }

    .form-label {
      display: grid;
      gap: 6px;
      color: var(--muted);
      font-size: 0.9rem;
    }

    input, select {
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #e1d7c7;
      font-size: 1rem;
      background: #fffefb;
      color: var(--ink);
    }

    button {
      background: var(--accent);
      border: none;
      color: white;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
    }

    button:hover {
      background: #c4693f;
    }
  `]
})
export class EntryFormComponent implements OnInit {
  @Input() type: 'income' | 'expense' = 'expense';
  @Input() categories: string[] = [];
  @Output() onSubmit = new EventEmitter<{ amount: number; category: string; description: string }>();

  amount = '';
  category = '';
  description = '';

  ngOnInit() {
    if (this.categories.length > 0) {
      this.category = this.categories[0];
    }
  }

  onSubmit_click() {
    if (!this.amount || !this.category) return;
    this.onSubmit.emit({
      amount: Number(this.amount),
      category: this.category,
      description: this.description
    });
    this.amount = '';
    this.description = '';
    if (this.categories.length > 0) {
      this.category = this.categories[0];
    }
  }
}
