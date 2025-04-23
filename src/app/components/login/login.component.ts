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
  ) { 
    console.log('Login component constructed');
  }

  ngOnInit() {
    console.log('Login component initialized');
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      console.log('User already authenticated, navigating based on role');
      this.navigateBasedOnRole();
    } else {
      console.log('User not authenticated, showing login form');
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
            console.error('Error loading profile:', err);
            this.error = 'Error loading user profile. Please try again.';
          }
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.error = 'Invalid email or password. Please try again.';
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
