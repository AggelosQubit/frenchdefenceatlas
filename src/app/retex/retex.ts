import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  signal,
  DestroyRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SiteNav } from '../nav/nav';
import { Billet, BilletImage, BilletIndex } from './retex.model';

@Component({
  selector: 'app-retex',
  imports: [RouterLink, SiteNav],
  templateUrl: './retex.html',
  styleUrl: './retex.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Retex {
  private readonly http = inject(HttpClient);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cache = new Map<number, Billet>();
  private readonly pending = new Set<number>();

  readonly id = input<string | undefined>();
  readonly catalog = signal<BilletIndex[]>([]);
  readonly articles = signal<Record<number, Billet>>({});
  readonly openBilletId = signal<number | null>(null);
  readonly openSectionId = signal<string | null>(null);
  readonly slideIndex = signal(0);

  readonly openBillet = computed(() => {
    const id = this.openBilletId();
    return id == null ? null : (this.articles()[id] ?? null);
  });

  readonly currentImage = computed<BilletImage | null>(() => {
    const billet = this.openBillet();
    const images = billet?.content.images ?? [];
    if (!images.length) {
      return null;
    }

    return images[this.slideIndex() % images.length] ?? null;
  });

  constructor() {
    this.http.get<BilletIndex[]>('/billets/index.json').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((items) => {
      const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      this.catalog.set(sorted);

      const routeId = this.parseId(this.id());
      const initial = routeId ?? (sorted.length === 1 ? sorted[0].id : null);

      if (initial != null) {
        this.openBilletId.set(initial);
        this.loadBillet(initial);
      }
    });

    effect(() => {
      const routeId = this.parseId(this.id());
      if (routeId == null) {
        return;
      }

      this.openBilletId.set(routeId);
      this.openSectionId.set(null);
      this.slideIndex.set(0);
      this.loadBillet(routeId);
    });
  }

  toggleBillet(id: number): void {
    const isClosing = this.openBilletId() === id;
    this.openBilletId.set(isClosing ? null : id);
    this.openSectionId.set(null);
    this.slideIndex.set(0);

    if (!isClosing) {
      this.loadBillet(id);
      this.location.replaceState(`/retex/${id}`);
      return;
    }

    this.location.replaceState('/retex');
  }

  toggleSection(sectionId: string): void {
    this.openSectionId.update((current) => (current === sectionId ? null : sectionId));
  }

  isBilletOpen(id: number): boolean {
    return this.openBilletId() === id;
  }

  isSectionOpen(sectionId: string): boolean {
    return this.openSectionId() === sectionId;
  }

  previousSlide(): void {
    const count = this.openBillet()?.content.images.length ?? 0;
    if (!count) {
      return;
    }

    this.slideIndex.update((index) => (index - 1 + count) % count);
  }

  nextSlide(): void {
    const count = this.openBillet()?.content.images.length ?? 0;
    if (!count) {
      return;
    }

    this.slideIndex.update((index) => (index + 1) % count);
  }

  goToSlide(index: number): void {
    this.slideIndex.set(index);
  }

  pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  formatDate(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    const months = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];

    return `${day} ${months[month - 1]} ${year}`;
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.openBillet()) {
      this.previousSlide();
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.openBillet()) {
      this.nextSlide();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.openSectionId()) {
      this.openSectionId.set(null);
      return;
    }

    if (this.openBilletId()) {
      this.openBilletId.set(null);
      this.location.replaceState('/retex');
    }
  }

  private parseId(value: string | undefined): number | null {
    if (!value) {
      return null;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  }

  private loadBillet(id: number): void {
    const cached = this.cache.get(id);
    if (cached) {
      this.articles.update((current) => ({ ...current, [id]: cached }));
      return;
    }

    if (this.pending.has(id)) {
      return;
    }

    this.pending.add(id);
    this.http.get<Billet>(`/billets/${id}/billet.json`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (billet) => {
        this.cache.set(id, billet);
        this.pending.delete(id);
        this.articles.update((current) => ({ ...current, [id]: billet }));
      },
      error: () => {
        this.pending.delete(id);
      },
    });
  }
}
