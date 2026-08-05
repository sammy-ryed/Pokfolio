export interface CardStats {
  name: string;
  avatarUrl: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  type: string;
  level: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawProfileData = any;

export interface Provider {
  name: string;
  fetchRawData(identifier: string, token?: string): Promise<RawProfileData>;
  mapToCardStats(raw: RawProfileData): CardStats;
}
