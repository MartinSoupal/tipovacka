export interface UserLeague {
  id: string;
  name: string;
  admins: string[];
  users: [];
  startedDate: Date;
  leagues: [];
}

export interface UserLeagueForUser {
  id: string;
  name: string;
  startedDate: Date;
  leagues: string[];
}
