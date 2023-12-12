export interface NewUserLeague {
  name: string;
  startedDate: Date;
  leagues: string[];
}

export interface UserLeague {
  id: string;
  name: string;
  startedDate: Date;
  leagues: string[];
  hasAdminRights: boolean;
}
