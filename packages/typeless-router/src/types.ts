export type HistoryType = 'browser' | 'hash';

export interface HistoryOptions {
  basePath?: string;
  type: HistoryType;
}

export type LocationChange =
  | string
  | {
      pathname: string;
      search?: string;
    };

export interface RouterLocation {
  pathname: string;
  search: string;
  type: 'push' | 'replace';
}

export interface RouterState {
  location: RouterLocation | null;
  prevLocation: RouterLocation | null;
}
