export interface StrategicDecision {
  readonly date: string;
  readonly title: string;
  readonly event: string;
  readonly problem: string;
  readonly decision: string;
  readonly consequence: string;
  readonly legacy: string;
}

export interface HistoryPeriod {
  readonly id: string;
  readonly number: string;
  readonly years: string;
  readonly shortTitle: string;
  readonly title: string;
  readonly summary: string;
  readonly centralQuestion: string;
  readonly context: readonly string[];
  readonly triggers: readonly string[];
  readonly decisions: readonly StrategicDecision[];
  readonly forces: readonly string[];
  readonly legacies: readonly string[];
  readonly image: string;
  readonly imagePosition: string;
}
