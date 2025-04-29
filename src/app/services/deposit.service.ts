import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Transaction } from "../interfaces/transaction.interface";
import { CreateTransactionRequest } from "../interfaces/create-transaction.interface";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new deposit transaction
   */
  createDeposit(request: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/crypto/deposits`,
      request
    );
  }

  /**
   * Create a new withdrawal request transaction
   */
  createWithdrawalRequest(
    request: CreateTransactionRequest
  ): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/crypto/withdraw`,
      request
    );
  }

  /**
   * Get all deposits for the current user
   */
  getUserDeposits(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/crypto/deposits/user`);
  }

  /**
   * Get all pending deposits (admin only)
   */
  getPendingDeposits(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/crypto/deposits/pending`
    );
  }

  /**
   * Approve a deposit transaction (admin only)
   */
  approveDeposit(transactionId: string): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/crypto/deposits/${transactionId}/approve`,
      {}
    );
  }

  /**
   * Reject a deposit transaction (admin only)
   */
  rejectDeposit(transactionId: string): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/crypto/deposits/${transactionId}/reject`,
      {}
    );
  }
}
