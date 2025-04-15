import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
  isOpen: boolean = false;
  role: string = "";
  isSidebarOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem("role") ?? "";
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    localStorage.removeItem("uid");
    this.router.navigate(["/login"]);
  }
}
