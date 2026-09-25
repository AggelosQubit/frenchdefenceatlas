export type RelationType =
  | 'direction'
  | 'information'
  | 'production'
  | 'transmission'
  | 'employment'
  | 'feedback';

export interface Organism {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly type: string;
  readonly category: string;
  readonly parent: string | null;
  readonly level: number;
  readonly officialDomain: string;
  readonly status: string;
  readonly description: string;
  readonly characteristics: {
    readonly domain: readonly string[];
    readonly authority: string;
    readonly role: string;
  };
  readonly visual?: {
    readonly position?: {
      readonly x: number;
      readonly y: number;
    };
  };
}

export interface OrganismCatalog {
  readonly meta: {
    readonly title: string;
    readonly version: string;
    readonly description: string;
  };
  readonly organismes: readonly Organism[];
}

export interface RelationStyle {
  readonly label: string;
  readonly question: string;
  readonly description: string;
  readonly color: string;
  readonly lineStyle: 'solid' | 'dashed';
  readonly arrow: 'forward' | 'back';
}

export interface GraphRelation {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly type: RelationType;
  readonly label: string;
}

export interface RelationCatalog {
  readonly meta: {
    readonly title: string;
    readonly version: string;
    readonly description: string;
  };
  readonly legend: Record<RelationType, RelationStyle>;
  readonly relations: readonly GraphRelation[];
}

export interface HierarchyLink {
  readonly id: string;
  readonly path: string;
  readonly parent: string;
  readonly child: string;
}

export interface GraphNodeView {
  readonly organism: Organism;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
