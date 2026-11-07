import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface DistributionGroup {
  type: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-portfolio-insights',
  imports: [DecimalPipe],
  templateUrl: './portfolio-insights.html',
  styleUrl: './portfolio-insights.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioInsights {
  readonly groups = input.required<readonly DistributionGroup[]>();
  readonly loading = input(false);
  readonly ready = input(false);
}
