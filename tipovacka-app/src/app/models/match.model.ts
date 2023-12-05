import {Team} from './team.model';

export interface Match {
  id: string;
  home: string;
  away: string;
  datetime: Date;
  stage: string;
  round: string;
  result: MatchResult;
  league: string;
  0: number;
  1: number;
  2: number;
  totalVotes: number;
  postponed: boolean;
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
  stage: string;
  round: string;
  league: string;
}

export interface EditedMatch {
  datetime: Date;
  result: MatchResult;
  postponed: boolean;
}

export type MatchResult = 0 | 1 | 2 | null;
