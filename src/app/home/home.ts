import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HISTORY_PERIODS } from '../histoire/histoire.data';
import { SiteNav } from '../nav/nav';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SiteNav],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly historyPeriods = HISTORY_PERIODS;
  readonly historyTotal = String(HISTORY_PERIODS.length).padStart(2, '0');
  readonly soundEnabled = signal(false);

  private readonly heroVideo =
    viewChild.required<ElementRef<HTMLVideoElement>>('heroVideo');

  constructor() {
    afterNextRender(() => {
      const video = this.heroVideo().nativeElement;

      video.defaultMuted = true;
      video.muted = true;
      void video.play().catch(() => undefined);
    });
  }

  toggleSound(): void {
    const enableSound = !this.soundEnabled();
    const video = this.heroVideo().nativeElement;

    video.volume = 0.7;
    video.muted = !enableSound;
    this.soundEnabled.set(enableSound);

    if (enableSound) {
      void video.play().catch(() => {
        video.muted = true;
        this.soundEnabled.set(false);
      });
    }
  }
}
