import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  template: ` <article class="metric-card panel h-full" [class.metric-featured]="featured()">
    <div class="flex items-center justify-between gap-3">
      <h2>{{ label() }}</h2>
      <span class="metric-icon"><i [class]="'bi ' + icon()" aria-hidden="true"></i></span>
    </div>
    <p class="metric-value">{{ value() }}</p>
    <p class="metric-description">{{ description() }}</p>
  </article>`,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .metric-card {
      padding: 21px 23px;
      transition:
        transform 0.2s,
        box-shadow 0.2s;
    }
    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px #102c2e0a;
    }
    h2 {
      margin: 0;
      font-size: 12px;
      font-weight: 550;
      color: var(--muted);
    }
    .metric-icon {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--subtle);
      color: var(--accent);
      font-size: 16px;
    }
    .metric-value {
      font-size: clamp(23px, 2.2vw, 32px);
      font-weight: 650;
      letter-spacing: -1px;
      line-height: 1.3;
      margin: 16px 0 9px;
      overflow-wrap: anywhere;
      font-variant-numeric: tabular-nums;
    }
    .metric-description {
      font-size: 11px;
      margin: 0;
      color: var(--muted);
    }
    .metric-featured {
      background: var(--featured);
      border-color: var(--featured-border);
    }
    .metric-featured .metric-icon {
      background: var(--featured-icon);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input.required<string>();
  readonly featured = input(false);
}
