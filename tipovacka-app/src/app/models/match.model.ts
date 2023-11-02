import {Team} from './team.model';

export interface Match {
  id: string;
  home: string;
  away: string;
  datetime: Date;
  round: number;
  result: MatchResult;
}

export interface MatchWithTeamName extends Match {
  homeTeam: Team;
  awayTeam: Team;
  daysTill: number;
  vote: MatchResult;
}

export interface NewMatch {
  home: string;
  away: string;
  datetime: Date;
  round: number;
}

export type MatchResult = 0 | 1 | 2 | null;
