import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  tradingMode: string;
  isActive: boolean;
  isSubscribed: boolean;
  poolInvestment: number;
  poolSharePercentage: number;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  wallet: {
    _id: string;
    balance: number;
    currency: string;
    isActive: boolean;
    poolContribution: number;
    poolSharePercentage: number;
    totalPnL: number;
  };
  lastLogin: string;
  pool?: {
    _id: string;
    name: string;
    totalCapital: number;
    activeCapital: number;
    totalPnL: number;
    totalTrades: number;
    winRate: number;
    isActive: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, { withCredentials: true });
  }
} 