import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private http = inject(HttpClient);

  // Proxy hoitaa localhost:3000, joten baseUrl voi olla suhteellinen
  private baseUrl = '/api/transactions';

  // READ
  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl);
  }

  // CREATE
  add(tx: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, tx);
  }

  // UPDATE
  update(tx: Transaction): Observable<Transaction> {
    const id = tx._id;
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, tx);
  }

  // DELETE
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
