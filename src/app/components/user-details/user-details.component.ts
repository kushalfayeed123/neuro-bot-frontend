import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InvestmentService } from "src/app/investment.service";

interface Balances {
  [currency: string]: number;
}

interface UserData {
  name: string;
  email: string;
  role: string;
  balances: Balances;
}

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {
  uid!: string;
  userData!: UserData;
  balances: { [key: string]: number } = {};
  error: string = "";
  message: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private investmentService: InvestmentService
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get("uid") || "";
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.investmentService.getUserDetails(this.uid).subscribe(
      (res: any) => {
        this.userData = res;
        // Create a local copy of balances for editing
        this.balances = { ...res.balances };
        console.log(this.balances["eth"]);
      },
      (err) => {
        this.error = "Failed to fetch user details";
      }
    );
  }

  updateBalances(): void {
    this.investmentService.showSpinner();
    const updateData = {
      uid: this.uid,
      balances: this.balances,
    };
    this.investmentService.updateUserBalances(updateData).subscribe({
      next: (res) => {
        this.message = "User balances updated successfully";
        this.investmentService.hideSpinner();
      },
      error: (err) => {
        this.error = "Failed to update balances";
        this.investmentService.hideSpinner();
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/admin"]);
  }
}
