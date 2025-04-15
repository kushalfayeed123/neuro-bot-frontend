import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

const API_BASE = "https://investment-app-backend.vercel.app"; // Adjust as needed
// const API_BASE = "http://localhost:3000"; // Adjust as needed

@Injectable({
  providedIn: "root",
})
export class InvestmentService {
  constructor(private http: HttpClient) {}

  public isLoading = new BehaviorSubject<boolean>(false);

  showSpinner(): void {
    this.isLoading.next(true);
  }

  hideSpinner(): void {
    this.isLoading.next(false);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${API_BASE}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${API_BASE}/login`, credentials);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("idToken");
    if (token) {
      return new HttpHeaders().set("Authorization", `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${API_BASE}/dashboard`, {
      headers: this.getAuthHeaders(),
    });
  }
  getLatestNews(): Observable<any> {
    return this.http.get(`${API_BASE}/dashboard`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Fetch user details by UID
  getUserDetails(uid: string): Observable<any> {
    return this.http.get(`${API_BASE}/admin/user/${uid}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update user balances
  updateUserBalances(updateData: any): Observable<any> {
    return this.http.put(
      `${API_BASE}/users/${updateData.uid}/balances`,
      updateData.balances,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getCurrencies(): Observable<any> {
    return this.http.get(`${API_BASE}/currencies`, {
      headers: this.getAuthHeaders(),
    });
  }

  deposit(depositData: any): Observable<any> {
    console.log(depositData);
    return this.http.post(`${API_BASE}/deposit`, depositData, {
      headers: this.getAuthHeaders(),
    });
  }

  withdraw(withdrawData: any): Observable<any> {
    return this.http.post(`${API_BASE}/withdraw`, withdrawData, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${API_BASE}/admin/users`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Updated approveDeposit endpoint to match the backend route.
  approveDeposit(depositApproval: any): Observable<any> {
    return this.http.post(
      `${API_BASE}/admin/approve-deposit`,
      depositApproval,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Fetch transactions by user ID
  getTransactionsByUserId(uid: string): Observable<any> {
    return this.http.get(`${API_BASE}/transactions/${uid}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Fetch all transactions
  getAllTransactions(): Observable<any> {
    return this.http.get(`${API_BASE}/transactions`, {
      headers: this.getAuthHeaders(),
    });
  }
}
