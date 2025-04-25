import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DepositTransaction {
  id: string;
  walletId: string;
  amount: number;
  txHash: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  userName?: string;
  currency?: string;
  type?: 'deposit' | 'withdraw';
  uid?: string;
}

export interface CreateDepositRequest {
  walletId: string;
  amount: number;
  txHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new deposit transaction
   */
  createDeposit(request: CreateDepositRequest): Observable<DepositTransaction> {
    return this.http.post<DepositTransaction>(`${this.apiUrl}/crypto/deposits`, request);
  }

  /**
   * Get all deposits for the current user
   */
  getUserDeposits(): Observable<DepositTransaction[]> {
    return this.http.get<DepositTransaction[]>(`${this.apiUrl}/crypto/deposits/user`);
  }

  /**
   * Get all pending deposits (admin only)
   */
  getPendingDeposits(): Observable<DepositTransaction[]> {
    return this.http.get<DepositTransaction[]>(`${this.apiUrl}/crypto/deposits/pending`);
  }

  /**
   * Approve a deposit transaction (admin only)
   */
  approveDeposit(transactionId: string): Observable<DepositTransaction> {
    return this.http.post<DepositTransaction>(
      `${this.apiUrl}/crypto/deposits/${transactionId}/approve`,
      {}
    );
  }

  /**
   * Reject a deposit transaction (admin only)
   */
  rejectDeposit(transactionId: string): Observable<DepositTransaction> {
    return this.http.post<DepositTransaction>(
      `${this.apiUrl}/crypto/deposits/${transactionId}/reject`,
      {}
    );
  }
} 