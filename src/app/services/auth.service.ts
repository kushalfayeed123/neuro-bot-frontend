import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    role: null
  });
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      this.authStateSubject.next({
        isAuthenticated: true,
        role
      });
    }
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload)
      .pipe(
        map(response => {
          // Ensure role is never undefined
          if (!response.role) {
            response.role = 'user'; // Default role
          }
          return response;
        })
      );
  }

  logout(): Observable<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.authStateSubject.next({
      isAuthenticated: false,
      role: null
    });
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const role = localStorage.getItem('role');
    return role || 'user'; // Default to 'user' if role is null or undefined
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if the user is still authenticated by making a request to the server
  checkAuthStatus(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean }>(`${this.apiUrl}/auth/check`, { withCredentials: true })
      .pipe(
        map(response => {
          this.authStateSubject.next({
            isAuthenticated: response.authenticated,
            role: this.getUserRole()
          });
          return response.authenticated;
        })
      );
  }
} 