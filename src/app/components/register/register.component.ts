import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';
  tradingMode: string = 'pooled';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    // Reset error message
    this.error = '';

    // Validate inputs
    if (!this.firstName || !this.lastName || !this.email || !this.phoneNumber || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(this.phoneNumber)) {
      this.error = 'Please enter a valid phone number (e.g. +1234567890)';
      return;
    }

    // Validate password match
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    // Validate password strength
    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters long';
      return;
    }

    // Create registration payload
    const userData = {
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phoneNumber: this.phoneNumber,
      firstName: this.firstName,
      lastName: this.lastName,
      role: 'user', // Default role
      tradingMode: this.tradingMode
    };

    // Call registration service
    this.authService.register(userData).subscribe({
      next: (response) => {
        // Registration successful
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Handle registration error
        this.error = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
