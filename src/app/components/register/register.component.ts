import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { InvestmentService } from "src/app/investment.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  user = {
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    cryptoWalletAddress: "",
  };
  error: string = "";

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) {}

  register() {
    this.investmentService.showSpinner();
    this.investmentService.register(this.user).subscribe({
      next: (res: any) => {
        this.investmentService.hideSpinner();
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        this.investmentService.hideSpinner();
        this.error = err.error.error || "Registration failed";
      },
    });
  }
}
