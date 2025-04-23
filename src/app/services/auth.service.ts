import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';

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
    console.log('AuthService constructor called');
    // Initialize auth state from localStorage
    this.initializeAuthState();
  }

  private initializeAuthState() {
    console.log('Initializing auth state from localStorage');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('Token from localStorage:', token ? 'exists' : 'not found');
    console.log('Role from localStorage:', role || 'not found');
    
    if (token && role) {
      console.log('Setting initial auth state to authenticated');
      this.authStateSubject.next({
        isAuthenticated: true,
        role
      });
    } else {
      console.log('Setting initial auth state to not authenticated');
      this.authStateSubject.next({
        isAuthenticated: false,
        role: null
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
        }),
        tap(response => {
          // Update auth state immediately after successful login
          this.authStateSubject.next({
            isAuthenticated: true,
            role: response.role
          });
          console.log('Auth state updated after login:', { isAuthenticated: true, role: response.role });
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
    console.log('Auth state updated after logout:', { isAuthenticated: false, role: null });
    return of(void 0);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('isAuthenticated check:', isAuth);
    return isAuth;
  }

  getUserRole(): string | null {
    const role = localStorage.getItem('role');
    console.log('getUserRole:', role || 'not found');
    return role || 'user'; // Default to 'user' if role is null or undefined
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if the user is still authenticated by making a request to the server
  checkAuthStatus(): Observable<boolean> {
    console.log('Checking auth status with server');
    return this.http.get<{ authenticated: boolean }>(`${this.apiUrl}/auth/check`)
      .pipe(
        map(response => {
          console.log('Auth check response:', response);
          this.authStateSubject.next({
            isAuthenticated: response.authenticated,
            role: this.getUserRole()
          });
          return response.authenticated;
        })
      );
  }
} 