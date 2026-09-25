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
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { SiteNav } from '../nav/nav';
import {
  GraphNodeView,
  GraphRelation,
  HierarchyLink,
  Organism,
  OrganismCatalog,
  RelationCatalog,
  RelationStyle,
  RelationType,
} from './architecture.model';

const NODE_WIDTH = 176;
const NODE_HEIGHT = 72;
const VIEW_WIDTH = 1600;
const VIEW_HEIGHT = 960;
const WORLD_PAD = 220;
const H_GAP = 64;
const V_GAP = 92;
const TREE_TOP = 96;
const PAN_THRESHOLD = 5;
const MIN_SCALE = 0.35;
const MAX_SCALE = 2.8;

function maxVisibleLevel(scale: number): number {
  if (scale < 0.62) {
    return 1;
  }

  if (scale < 0.92) {
    return 2;
  }

  return Number.POSITIVE_INFINITY;
}

@Component({
  selector: 'app-architecture',
  imports: [RouterLink, SiteNav],
  templateUrl: './architecture.html',
  styleUrl: './architecture.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Architecture {
  private readonly http = inject(HttpClient);
  private readonly location = inject(Location);

  readonly id = input<string | undefined>();
  readonly organisms = signal<readonly Organism[]>([]);
  readonly relations = signal<readonly GraphRelation[]>([]);
  readonly legend = signal<Partial<Record<RelationType, RelationStyle>>>({});
  readonly selectedId = signal<string | null>(null);
  readonly loadError = signal(false);
  readonly pan = signal({ x: 0, y: 0 });
  readonly scale = signal(1);
  readonly panning = signal(false);
  readonly focusing = signal(false);

  private canvasEl: HTMLElement | null = null;
  private readonly onWheel = (event: WheelEvent) => this.onCanvasWheel(event);

  private pointer: {
    id: number;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    moved: boolean;
    nodeId: string | null;
  } | null = null;

  readonly selected = computed(() => {
    const id = this.selectedId();
    return this.organisms().find((organism) => organism.id === id) ?? null;
  });

  readonly legendItems = computed(() => {
    const legend = this.legend();
    return (Object.entries(legend) as [RelationType, RelationStyle][]).filter(
      ([, style]) => style,
    );
  });

  readonly visibleLevel = computed(() => maxVisibleLevel(this.scale()));

  readonly allNodes = computed<readonly GraphNodeView[]>(() =>
    this.layoutTree(this.organisms()),
  );

  readonly nodes = computed<readonly GraphNodeView[]>(() => {
    const level = this.visibleLevel();
    return this.allNodes().filter((node) => node.organism.level <= level);
  });

  readonly links = computed<readonly HierarchyLink[]>(() => {
    const visible = new Map(this.nodes().map((node) => [node.organism.id, node]));
    const links: HierarchyLink[] = [];

    for (const node of this.nodes()) {
      const parentId = node.organism.parent;
      if (!parentId) {
        continue;
      }

      const parent = visible.get(parentId);
      if (!parent) {
        continue;
      }

      links.push({
        id: `${parentId}->${node.organism.id}`,
        path: this.hierarchyPath(parent, node),
        parent: parentId,
        child: node.organism.id,
      });
    }

    return links;
  });

  readonly focusLineage = computed(() => {
    const id = this.selectedId();
    if (!id) {
      return null;
    }

    return this.collectLineage(id);
  });

  readonly world = computed(() => {
    const nodes = this.allNodes();
    if (!nodes.length) {
      return { minX: 0, minY: 0, width: VIEW_WIDTH, height: VIEW_HEIGHT };
    }

    const minX = Math.min(...nodes.map((node) => node.x - node.width / 2)) - WORLD_PAD;
    const minY = Math.min(...nodes.map((node) => node.y - node.height / 2)) - WORLD_PAD;
    const maxX = Math.max(...nodes.map((node) => node.x + node.width / 2)) + WORLD_PAD;
    const maxY = Math.max(...nodes.map((node) => node.y + node.height / 2)) + WORLD_PAD;

    return {
      minX,
      minY,
      width: Math.max(VIEW_WIDTH, maxX - minX),
      height: Math.max(VIEW_HEIGHT, maxY - minY),
    };
  });

  readonly viewBox = computed(() => {
    const world = this.world();
    return `${world.minX} ${world.minY} ${world.width} ${world.height}`;
  });

  readonly worldTransform = computed(() => {
    const pan = this.pan();
    return `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${this.scale()})`;
  });

  readonly relatedEdges = computed(() => {
    const id = this.selectedId();
    if (!id) {
      return [];
    }

    return this.relations().filter((relation) => relation.source === id || relation.target === id);
  });

  readonly organismCount = computed(() => String(this.organisms().length).padStart(2, '0'));

  constructor() {
    forkJoin({
      organismes: this.http.get<OrganismCatalog>('/architecture/organismes.json'),
      relations: this.http.get<RelationCatalog>('/architecture/relations.json'),
    }).subscribe({
      next: ({ organismes, relations }) => {
        this.organisms.set(organismes.organismes);
        this.relations.set(relations.relations);
        this.legend.set(relations.legend);

        const routeId = this.id();
        if (routeId && organismes.organismes.some((organism) => organism.id === routeId)) {
          this.selectedId.set(routeId);
        }
      },
      error: () => this.loadError.set(true),
    });

    effect(() => {
      const routeId = this.id();
      if (!routeId) {
        return;
      }

      if (this.organisms().some((organism) => organism.id === routeId)) {
        this.selectedId.set(routeId);
      }
    });

    afterNextRender(() => this.bindCanvasWheel());

    effect(() => {
      this.organisms();
      this.loadError();
      queueMicrotask(() => this.bindCanvasWheel());
    });
  }

  private bindCanvasWheel(): void {
    const el = document.querySelector<HTMLElement>('.atlas__canvas');
    if (el === this.canvasEl) {
      return;
    }

    this.canvasEl?.removeEventListener('wheel', this.onWheel);
    this.canvasEl = el;
    el?.addEventListener('wheel', this.onWheel, { passive: false });
  }

  select(id: string): void {
    const closing = this.selectedId() === id;
    this.selectedId.set(closing ? null : id);
    this.location.replaceState(closing ? '/architecture' : `/architecture/${id}`);

    if (!closing) {
      this.panToNode(id);
    }
  }

  isInLineage(id: string): boolean {
    const lineage = this.focusLineage();
    return !lineage || lineage.has(id);
  }

  organismName(id: string): string {
    return this.organisms().find((organism) => organism.id === id)?.shortName ?? id;
  }

  legendStyle(type: RelationType): RelationStyle | undefined {
    return this.legend()[type];
  }

  officialHref(domain: string): string {
    return domain.startsWith('http') ? domain : `https://${domain}`;
  }

  scrollToAtlas(event: Event): void {
    event.preventDefault();
    const target = document.getElementById('atlas');
    if (!target) {
      return;
    }

    const offset = window.matchMedia('(max-width: 760px)').matches ? 88 : 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  onNodePointerDown(event: PointerEvent, id: string): void {
    if (this.pointer) {
      this.pointer.nodeId = id;
    } else {
      this.pointer = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        panX: this.pan().x,
        panY: this.pan().y,
        moved: false,
        nodeId: id,
      };
    }
  }

  onCanvasPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    try {
      if (!target.hasPointerCapture?.(event.pointerId)) {
        target.setPointerCapture(event.pointerId);
      }
    } catch {
      // Synthetic or already-released pointers can reject capture.
    }
    this.pointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: this.pan().x,
      panY: this.pan().y,
      moved: false,
      nodeId: this.pointer?.nodeId ?? null,
    };
  }

  onCanvasPointerMove(event: PointerEvent): void {
    if (!this.pointer || event.pointerId !== this.pointer.id) {
      return;
    }

    const dx = event.clientX - this.pointer.startX;
    const dy = event.clientY - this.pointer.startY;
    if (!this.pointer.moved && Math.hypot(dx, dy) < PAN_THRESHOLD) {
      return;
    }

    this.pointer.moved = true;
    this.focusing.set(false);
    this.panning.set(true);
    this.pan.set({
      x: this.pointer.panX + dx,
      y: this.pointer.panY + dy,
    });
  }

  onCanvasPointerUp(event: PointerEvent): void {
    if (!this.pointer || event.pointerId !== this.pointer.id) {
      return;
    }

    const { moved, nodeId } = this.pointer;
    this.pointer = null;
    this.panning.set(false);

    if (!moved && nodeId) {
      this.select(nodeId);
    }
  }

  onCanvasWheel(event: WheelEvent): void {
    event.preventDefault();
    this.focusing.set(false);

    let delta = event.deltaY;
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      delta *= 16;
    } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      delta *= 400;
    }

    this.zoomAt(Math.exp(-delta * 0.0024), event.clientX, event.clientY);
  }

  resetPan(): void {
    this.focusing.set(true);
    this.pan.set({ x: 0, y: 0 });
    this.scale.set(1);
  }

  private zoomAt(factor: number, clientX?: number, clientY?: number): void {
    const current = this.scale();
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current * factor));
    if (next === current) {
      return;
    }

    const canvas = this.canvasEl;
    if (canvas && clientX !== undefined && clientY !== undefined) {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const ratio = next / current;
      const pan = this.pan();
      this.pan.set({
        x: mx - cx - ratio * (mx - cx - pan.x),
        y: my - cy - ratio * (my - cy - pan.y),
      });
    }

    this.scale.set(next);
  }

  private panToNode(id: string): void {
    const node = this.allNodes().find((item) => item.organism.id === id);
    const world = this.world();
    if (!node) {
      return;
    }

    const scale = this.scale();
    this.focusing.set(true);
    this.pan.set({
      x: scale * (world.width / 2 - (node.x - world.minX)),
      y: scale * (world.height / 2 - (node.y - world.minY)),
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedId()) {
      this.selectedId.set(null);
      this.location.replaceState('/architecture');
    }
  }

  private layoutTree(organisms: readonly Organism[]): GraphNodeView[] {
    if (!organisms.length) {
      return [];
    }

    const byId = new Map(organisms.map((organism) => [organism.id, organism]));
    const children = new Map<string | null, Organism[]>();

    for (const organism of organisms) {
      const key = organism.parent && byId.has(organism.parent) ? organism.parent : null;
      const group = children.get(key) ?? [];
      group.push(organism);
      children.set(key, group);
    }

    const rows = new Map<string, number>();
    const rowOf = (organism: Organism): number => {
      const cached = rows.get(organism.id);
      if (cached !== undefined) {
        return cached;
      }

      const parent = organism.parent ? byId.get(organism.parent) : undefined;
      const row = parent
        ? Math.max(organism.level - 1, rowOf(parent) + 1)
        : Math.max(0, organism.level - 1);
      rows.set(organism.id, row);
      return row;
    };

    const spanOf = (organism: Organism): number => {
      const kids = children.get(organism.id) ?? [];
      if (!kids.length) {
        return NODE_WIDTH;
      }

      return Math.max(
        NODE_WIDTH,
        kids.reduce((total, child, index) => total + spanOf(child) + (index ? H_GAP : 0), 0),
      );
    };

    const placed = new Map<string, GraphNodeView>();
    const place = (organism: Organism, left: number): void => {
      const kids = children.get(organism.id) ?? [];
      const span = spanOf(organism);
      let x: number;

      if (!kids.length) {
        x = left + span / 2;
      } else {
        let cursor = left;
        for (const child of kids) {
          place(child, cursor);
          cursor += spanOf(child) + H_GAP;
        }

        x = (placed.get(kids[0].id)!.x + placed.get(kids[kids.length - 1].id)!.x) / 2;
      }

      placed.set(organism.id, {
        organism,
        x,
        y: TREE_TOP + rowOf(organism) * (NODE_HEIGHT + V_GAP) + NODE_HEIGHT / 2,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    };

    let cursor = 0;
    for (const root of children.get(null) ?? []) {
      place(root, cursor);
      cursor += spanOf(root) + H_GAP;
    }

    return organisms.map((organism) => placed.get(organism.id)).filter((node): node is GraphNodeView => !!node);
  }

  private hierarchyPath(parent: GraphNodeView, child: GraphNodeView): string {
    const parentBottom = parent.y + parent.height / 2;
    const childTop = child.y - child.height / 2;
    const busY = parentBottom + Math.max(28, (childTop - parentBottom) / 2);

    if (Math.abs(parent.x - child.x) < 1) {
      return `M ${parent.x} ${parentBottom} L ${child.x} ${childTop}`;
    }

    return `M ${parent.x} ${parentBottom} L ${parent.x} ${busY} L ${child.x} ${busY} L ${child.x} ${childTop}`;
  }

  private collectLineage(id: string): Set<string> {
    const lineage = new Set<string>([id]);
    const byId = new Map(this.organisms().map((organism) => [organism.id, organism]));

    let current = byId.get(id);
    while (current?.parent) {
      lineage.add(current.parent);
      current = byId.get(current.parent);
    }

    const walk = (parentId: string): void => {
      for (const organism of this.organisms()) {
        if (organism.parent === parentId) {
          lineage.add(organism.id);
          walk(organism.id);
        }
      }
    };

    walk(id);
    return lineage;
  }
}
