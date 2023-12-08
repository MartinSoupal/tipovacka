export interface UserLeague extends UserLeagueData {
  id: string;
}

export interface UserLeagueData {
  name: string;
  admins: string[];
  users: string[];
  startedDate: Date;
  leagues: string[];
}

export interface UserLeagueForUser {
  id: string;
  name: string;
  startedDate: Date;
  leagues: string[];
}
