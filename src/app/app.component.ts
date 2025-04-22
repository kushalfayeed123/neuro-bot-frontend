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
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        // Use a type guard to narrow the event to NavigationEnd
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        // Hide navbar on login and register routes
        this.showNavbar = !["/login", "/register"].includes(
          event.urlAfterRedirects
        );
      });

    // Check if the user is authenticated on page load
    this.authService.checkAuthStatus().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        // If authenticated, fetch the user profile
        this.userService.getProfile().subscribe(profile => {
          // Store role in localStorage if needed
          if (profile.role) {
            localStorage.setItem('role', profile.role);
          }
          
          // Update auth state
          this.authService.authState$.subscribe(state => {
            console.log('Auth state updated:', state);
          });
        });
      }
    });
  }
}
