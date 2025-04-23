import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, Event } from "@angular/router";
import { filter } from "rxjs/operators";
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    console.log('App component constructor called');
    // Check if we're on login or register page on initial load
    const currentPath = this.router.url;
    console.log('Current path:', currentPath);
    if (currentPath === '/login' || currentPath === '/register') {
      this.showNavbar = false;
      console.log('Navbar hidden for login/register page');
    }
  }

  ngOnInit() {
    console.log('App component initialized');
    
    // Subscribe to auth state changes
    this.authService.authState$.subscribe(state => {
      console.log('Auth state changed:', state);
      
      // If authenticated and on login/register page, redirect to dashboard
      if (state.isAuthenticated) {
        const currentPath = this.router.url;
        if (currentPath === '/login' || currentPath === '/register') {
          console.log('User is authenticated, redirecting from login/register to dashboard');
          this.router.navigate(['/dashboard']);
        }
      }
    });

    // Check if the user is authenticated on page load
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('Initial auth status check:', isAuthenticated);
    
    if (isAuthenticated) {
      // If authenticated, fetch the user profile
      this.userService.getProfile().subscribe(profile => {
        console.log('User profile loaded:', profile);
        // Store role in localStorage if needed
        if (profile.role) {
          localStorage.setItem('role', profile.role);
        }
      });
    }

    this.router.events
      .pipe(
        // Use a type guard to narrow the event to NavigationEnd
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        console.log('Navigation event:', event.urlAfterRedirects);
        // Hide navbar on login and register routes
        this.showNavbar = !(
          event.urlAfterRedirects === "/login" ||
          event.urlAfterRedirects === "/register"
        );
        console.log('Navbar visibility:', this.showNavbar);
      });
  }
}
