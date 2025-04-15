import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { InvestmentService } from "src/app/investment.service";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  error: string = "";
  message: string = "";

  constructor(
    private router: Router,
    private investmentService: InvestmentService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.investmentService.getAllUsers().subscribe(
      (res: any) => {
        this.users = res;
      },
      (err) => {
        this.error = "Failed to fetch users";
      }
    );
  }

  goToUserDetails(user: any): void {
    // Navigate to the User Details component with the selected user's uid
    this.router.navigate(["/user-details", user.uid]);
  }
}
