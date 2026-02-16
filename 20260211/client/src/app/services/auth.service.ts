import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface User {
  username: string;
}

export interface LoginPayload {
  username: string;
  pin: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBase = 'http://localhost:4000';
  private userSubject = new BehaviorSubject<User | null>(null);
  isAuthenticated$ = this.userSubject.asObservable().pipe(
    tap(user => user ? this.setTheme() : null)
  );

  constructor(private http: HttpClient) {}

  checkSession(): void {
    this.http.get<{ user: User }>(`${this.apiBase}/me`, { withCredentials: true })
      .pipe(
        catchError(() => {
          this.userSubject.next(null);
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) {
          this.userSubject.next(result.user);
        }
      });
  }

  login(username: string, pin: string): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(
      `${this.apiBase}/login`,
      { username, pin },
      { withCredentials: true }
    ).pipe(
      tap(result => this.userSubject.next(result.user))
    );
  }

  logout(): void {
    this.http.post(`${this.apiBase}/logout`, {}, { withCredentials: true })
      .subscribe(() => this.userSubject.next(null));
  }

  private setTheme(): void {
    const theme = localStorage.getItem('theme') || 'light';
    (document.documentElement.dataset as any)['theme'] = theme;
  }

  toggleTheme(): void {
    const currentTheme = (document.documentElement.dataset as any)['theme'] || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    (document.documentElement.dataset as any)['theme'] = newTheme;
    localStorage.setItem('theme', newTheme);
  }
}
