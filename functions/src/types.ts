import {Request} from 'express';

export interface CustomRequest extends Request {
  userUid: string;
  admin: boolean;
  headers: {
    authorization: string;
  };
}

export interface ApiResponse {
  get: string;
  parameters: {
    live: string;
  };
  errors: any[]; // Assuming errors is an array, but its type might vary
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: FixtureResponse[];
}

export interface FixtureResponse {
  fixture: Fixture;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
}

export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number | null;
  };
  venue: Venue;
  status: Status;
}

interface Venue {
  id: number;
  name: string;
  city: string;
}

interface Status {
  long: string;
  short: string;
  elapsed: number;
}

interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
}

interface Teams {
  home: Team;
  away: Team;
}

interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

interface Goals {
  home: number;
  away: number;
}

interface Score {
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
}

