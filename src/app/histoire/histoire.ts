import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { HISTORY_PERIODS } from './histoire.data';
import { DOCUMENTARIES, DOCUMENTARY_CATEGORIES } from './histoire.documentaires.data';
import { Documentary, DocumentaryCategory, StrategicDecision } from './histoire.model';
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
  private readonly location = inject(Location);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly embeds = new Map<string, SafeResourceUrl>();

  readonly id = input<string | undefined>();
  readonly docId = input<string | undefined>();
  readonly periods = HISTORY_PERIODS;
  readonly categories = DOCUMENTARY_CATEGORIES;
  readonly documentaries = DOCUMENTARIES;
  readonly totalLabel = String(HISTORY_PERIODS.length).padStart(2, '0');
  readonly docsLabel = String(DOCUMENTARIES.length).padStart(2, '0');
  readonly openDecisionIndex = signal<number | null>(null);
  readonly openDocId = signal<string | null>(null);

  readonly selectedPeriod = computed(() => {
    const id = this.id();
    return this.periods.find((period) => period.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      const period = this.selectedPeriod();
      this.openDecisionIndex.set(null);

      if (period) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });

    effect(() => {
      const docId = this.docId();
      if (!docId || !this.documentaries.some((film) => film.id === docId)) {
        return;
      }

      this.openDocId.set(docId);
    });

    afterNextRender(() => {
      const docId = this.docId();
      if (!docId) {
        return;
      }

      const target = document.getElementById(`doc-${docId}`) ?? document.getElementById('documentaires');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  filmsFor(category: DocumentaryCategory): readonly Documentary[] {
    return this.documentaries
      .filter((film) => film.category === category.id)
      .slice()
      .sort((left, right) => left.year - right.year || left.title.localeCompare(right.title, 'fr'));
  }

  toggleDecision(index: number): void {
    this.openDecisionIndex.update((current) => (current === index ? null : index));
  }

  isDecisionOpen(index: number): boolean {
    return this.openDecisionIndex() === index;
  }

  toggleDocumentary(id: string): void {
    const closing = this.openDocId() === id;
    this.openDocId.set(closing ? null : id);
    this.location.replaceState(closing ? '/histoire' : `/histoire/documentaires/${id}`);
  }

  isDocumentaryOpen(id: string): boolean {
    return this.openDocId() === id;
  }

  youtubeId(url: string): string | null {
    try {
      return new URL(url).searchParams.get('v');
    } catch {
      return null;
    }
  }

  thumbnailUrl(url: string): string {
    const id = this.youtubeId(url);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
  }

  embedUrl(url: string): SafeResourceUrl | null {
    const id = this.youtubeId(url);
    if (!id) {
      return null;
    }

    const cached = this.embeds.get(id);
    if (cached) {
      return cached;
    }

    const embed = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}`,
    );
    this.embeds.set(id, embed);
    return embed;
  }

  onThumbnailError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (image.dataset['fallback'] === '1') {
      return;
    }

    const id = image.src.match(/\/vi\/([^/]+)\//)?.[1];
    if (!id) {
      return;
    }

    image.dataset['fallback'] = '1';
    image.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  }

  decisionKey(decision: StrategicDecision, index: number): string {
    return `${decision.date}-${index}`;
  }

  pad(index: number): string {
    return String(index).padStart(2, '0');
  }

  scrollToAnchor(event: Event, id: string): void {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const offset = window.matchMedia('(max-width: 760px)').matches ? 88 : 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.openDocId()) {
      this.openDocId.set(null);
      this.location.replaceState('/histoire');
      return;
    }

    if (this.openDecisionIndex() !== null) {
      this.openDecisionIndex.set(null);
      return;
    }

    if (this.selectedPeriod()) {
      void this.router.navigate(['/histoire']);
    }
  }
}
