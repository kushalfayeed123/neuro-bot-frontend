import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { UserDashboardComponent } from "./components/user-dashboard/user-dashboard.component";
import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component";
import { DepositComponent } from "./components/deposit/deposit.component";
import { WithdrawComponent } from "./components/withdraw/withdraw.component";
import { InvestmentService } from "./investment.service";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { CryptoChartComponent } from "./components/crypto-chart/crypto-chart.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TransactionsComponent } from "./components/transactions/transactions.component";
import { LiveNewsComponent } from "./components/live-news/live-news.component";
import { InvestmentDistributionChartComponent } from "./components/investment-distribution-chart/investment-distribution-chart.component";
import { PerformanceSummaryChartComponent } from "./components/performance-summary-chart/performance-summary-chart.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { AdminTransactionsComponent } from './components/admin-transactions/admin-transactions.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { WalletService } from './services/wallet.service';
import { TransactionService } from './services/deposit.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    DepositComponent,
    WithdrawComponent,
    NavbarComponent,
    SpinnerComponent,
    UserDetailsComponent,
    CryptoChartComponent,
    TransactionsComponent,
    LiveNewsComponent,
    InvestmentDistributionChartComponent,
    PerformanceSummaryChartComponent,
    AdminTransactionsComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgApexchartsModule
  ],
  providers: [
    InvestmentService,
    AuthService,
    UserService,
    WalletService,
    TransactionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
