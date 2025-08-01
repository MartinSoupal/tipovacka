import {BehaviorSubject} from 'rxjs';
import {Vote} from './vote.model';

export interface Fixture {
  id: string;
  date: Date;
  leagueName: string;
  round: string;
  season: number;
  homeTeam: Team2;
  awayTeam: Team2;
  result: 0 | 1 | 2 | null;
  status: string;
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

interface Team2 {
  id: string;
  name: string;
}

export type FixturesObservables = Record<string, BehaviorSubject<Fixture[]> | undefined>;

export type VotesObservables = Record<string, BehaviorSubject<Record<string, Vote>> | undefined>;
