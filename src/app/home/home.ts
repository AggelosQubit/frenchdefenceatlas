import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly menuOpen = signal(false);
  readonly soundEnabled = signal(false);

  private readonly heroVideo =
    viewChild.required<ElementRef<HTMLVideoElement>>('heroVideo');

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
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
