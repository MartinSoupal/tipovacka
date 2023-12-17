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

export interface UserInUserLeague {
  userUid: string;
  name: string;
  hasAdminRights: boolean;
}
