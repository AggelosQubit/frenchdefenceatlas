import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HISTORY_PERIODS } from './histoire.data';
import { StrategicDecision } from './histoire.model';
import { SiteNav } from '../nav/nav';

@Component({
  selector: 'app-histoire',
  imports: [RouterLink, SiteNav],
  templateUrl: './histoire.html',
  styleUrl: './histoire.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Histoire {
  private readonly router = inject(Router);

  readonly id = input<string | undefined>();
  readonly periods = HISTORY_PERIODS;
  readonly totalLabel = String(HISTORY_PERIODS.length).padStart(2, '0');
  readonly openDecisionIndex = signal<number | null>(null);

  readonly selectedPeriod = computed(() => {
    const id = this.id();
    return this.periods.find((period) => period.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      const id = this.id();
      this.openDecisionIndex.set(null);

      if (id) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
  }

  toggleDecision(index: number): void {
    this.openDecisionIndex.update((current) => (current === index ? null : index));
  }

  isDecisionOpen(index: number): boolean {
    return this.openDecisionIndex() === index;
  }

  decisionKey(decision: StrategicDecision, index: number): string {
    return `${decision.date}-${index}`;
  }

  pad(index: number): string {
    return String(index).padStart(2, '0');
  }

  scrollToPeriods(event: Event): void {
    event.preventDefault();
    const target = document.getElementById('periodes');
    if (!target) {
      return;
    }

    const offset = window.matchMedia('(max-width: 760px)').matches ? 88 : 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.openDecisionIndex() !== null) {
      this.openDecisionIndex.set(null);
      return;
    }

    if (this.selectedPeriod()) {
      void this.router.navigate(['/histoire']);
    }
  }
}
