import {Team} from './team.model';

export interface Match {
  id: string;
  home: string;
  away: string;
  datetime: Date;
  stage: string;
  round: string;
  result: MatchResult;
  league: League;
  0: number;
  1: number;
  2: number;
  totalVotes: number;
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
  league: League;
}

export type MatchResult = 0 | 1 | 2 | null;

export type League = 'FL' | 'EURO24';

export type Stage = 'Základní část' | 'Nadstavba' | 'Skupinová fáze' | 'Vyřazovací fáze';
