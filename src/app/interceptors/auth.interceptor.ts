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
    'https://financialmodelingprep.com/api/v3/stock/real-time-price',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/check'
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    console.log('Auth interceptor constructed');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request:', request.url);
    
    // Check if the request URL is in the excluded list
    const isExcludedUrl = this.excludedUrls.some(url => request.url.includes(url));
    
    if (isExcludedUrl) {
      console.log('Request excluded from auth interceptor:', request.url);
      return next.handle(request);
    }
    
    // Get the token from localStorage
    const token = this.authService.getToken();
    
    if (token) {
      console.log('Adding auth token to request');
      // Clone the request and add the authorization header
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Auth interceptor error:', error);
          
          // If the error is 401 Unauthorized, redirect to login
          if (error.status === 401) {
            console.log('Unauthorized request, redirecting to login');
            this.authService.logout().subscribe();
            this.router.navigate(['/login']);
          }
          
          return throwError(error);
        })
      );
    }
    
    console.log('No auth token found, proceeding with original request');
    return next.handle(request);
  }
} 