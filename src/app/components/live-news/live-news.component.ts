import { Component, OnInit } from "@angular/core";
import { InvestmentService } from "src/app/investment.service";

@Component({
  selector: "app-live-news",
  templateUrl: "./live-news.component.html",
  styleUrls: ["./live-news.component.css"],
})
export class LiveNewsComponent implements OnInit {
  newsItems: any[] = [];

  constructor(private newsService: InvestmentService) {}

  ngOnInit(): void {
    this.newsService.getLatestNews().subscribe({
      next: (data) => {
        this.newsItems = data;
      },
      error: (error) => {
        this.newsItems = [
          { title: "Default News 1", url: "#" },
          { title: "Default News 2", url: "#" },
          { title: "Default News 3", url: "#" },
        ];
      },
    });
  }
}
