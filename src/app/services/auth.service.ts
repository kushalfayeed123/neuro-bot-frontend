import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private csrfTokenKey = 'XSRF-TOKEN';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, 
      { email, password },
      { 
        headers: this.getHeaders(),
        withCredentials: true // This is important for cookie handling
      }
    );
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, 
      userData,
      { 
        headers: this.getHeaders(),
        withCredentials: true
      }
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, 
      {},
      { 
        headers: this.getHeaders(),
        withCredentials: true
      }
    ).pipe(
      tap(() => {
        // Clear any client-side state if needed
        localStorage.removeItem(this.csrfTokenKey);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/auth/check`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
} 