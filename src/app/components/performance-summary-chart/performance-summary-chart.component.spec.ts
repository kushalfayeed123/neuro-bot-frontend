import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceSummaryChartComponent } from './performance-summary-chart.component';

describe('PerformanceSummaryChartComponent', () => {
  let component: PerformanceSummaryChartComponent;
  let fixture: ComponentFixture<PerformanceSummaryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceSummaryChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceSummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
