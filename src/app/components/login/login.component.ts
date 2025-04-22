import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.navigateBasedOnRole();
    }
  }

  login() {
    this.error = ''; // Clear any previous errors
    console.log('Attempting login with:', this.email);
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        // Store token and role in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        console.log('Token and role stored in localStorage');
        
        // Fetch user profile
        console.log('Fetching user profile...');
        this.userService.getProfile().subscribe({
          next: (profile) => {
            console.log('Profile loaded successfully:', profile);
            // Navigate based on role
            this.navigateBasedOnRole();
          },
          error: (err) => {
            console.error('Profile fetch error:', err);
            // Still navigate even if profile fetch fails
            this.navigateBasedOnRole();
          }
        });
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Login failed';
      }
    });
  }

  private navigateBasedOnRole() {
    const role = this.authService.getUserRole();
    console.log('Navigating based on role:', role);
    
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
