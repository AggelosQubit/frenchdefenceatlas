export interface BilletQuote {
  readonly text: string;
  readonly source?: string;
}

export interface BilletSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly quotes?: readonly BilletQuote[];
}

export interface BilletImage {
  readonly src: string;
  readonly alt: string;
}

export interface BilletContent {
  readonly eventDate: string;
  readonly place: string;
  readonly lead: string;
  readonly images: readonly BilletImage[];
  readonly sections: readonly BilletSection[];
}

export interface BilletIndex {
  readonly id: number;
  readonly date: string;
  readonly titre: string;
  readonly Author: string;
}

export interface Billet extends BilletIndex {
  readonly content: BilletContent;
}
