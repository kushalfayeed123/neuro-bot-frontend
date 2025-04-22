import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // List of URLs that should not be intercepted
  private excludedUrls = [
    'https://api.coingecko.com/api/v3/coins/markets',
    'https://financialmodelingprep.com/api/v3/stock/real-time-price'
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request URL is in the excluded list
    const isExcludedUrl = this.excludedUrls.some(url => request.url.includes(url));
    
    // If it's an excluded URL, just pass the request through without modification
    if (isExcludedUrl) {
      return next.handle(request);
    }
    
    // Get the token from the auth service
    const token = this.authService.getToken();
    
    // Clone the request and add the authorization header if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Add secure headers to all requests
    request = request.clone({
      withCredentials: true,
      headers: request.headers
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
} 