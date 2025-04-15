import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentDistributionChartComponent } from './investment-distribution-chart.component';

describe('InvestmentDistributionChartComponent', () => {
  let component: InvestmentDistributionChartComponent;
  let fixture: ComponentFixture<InvestmentDistributionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentDistributionChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
