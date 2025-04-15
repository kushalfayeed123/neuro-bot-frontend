import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, Event } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;

  constructor(private router: Router) {}

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
  }
}
