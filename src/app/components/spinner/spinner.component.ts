import { Component, OnInit } from "@angular/core";
import { InvestmentService } from "src/app/investment.service";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.css"],
})
export class SpinnerComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private spinnerService: InvestmentService) {}

  ngOnInit(): void {
    this.spinnerService.isLoading.subscribe((state) => {
      this.isLoading = state;
    });
  }
}
