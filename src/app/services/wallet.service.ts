import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Wallet {
  _id: string;
  currency: string;
  network: string;
  address: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWalletRequest {
  currency: string;
  network: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('WalletService initialized');
  }

  /**
   * Create a new wallet for the authenticated user
   */
  createWallet(request: CreateWalletRequest): Observable<Wallet> {
    console.log('Creating wallet:', request);
    return this.http.post<Wallet>(`${this.apiUrl}/crypto/wallets`, request);
  }

  /**
   * Get a wallet by its ID
   */
  getWalletById(walletId: string): Observable<Wallet> {
    console.log('Getting wallet by ID:', walletId);
    return this.http.get<Wallet>(`${this.apiUrl}/crypto/wallets/${walletId}`);
  }

  /**
   * Get all available wallets for the authenticated user
   */
  getAvailableWallets(): Observable<Wallet[]> {
    console.log('Getting available wallets');
    return this.http.get<Wallet[]>(`${this.apiUrl}/crypto/wallets`);
  }

  /**
   * Get a wallet by currency and network
   */
  getWalletByCurrencyAndNetwork(currency: string, network: string): Observable<Wallet> {
    console.log('Getting wallet by currency and network:', { currency, network });
    return this.http.get<Wallet>(`${this.apiUrl}/crypto/wallets/${currency}/${network}`);
  }
} 