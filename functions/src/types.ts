import {Request} from 'express';

export interface CustomRequest extends Request {
  userUid: string;
  admin: boolean;
  headers: {
    authorization: string;
  };
}

export interface FixtureApiResponse {
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

export interface StaningsApiResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: LeagueResponse[];
}

interface LeagueResponse {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: Standing[][];
  };
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: MatchStats;
  home: MatchStats;
  away: MatchStats;
  update: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface MatchStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

export interface LeagueAPIResponse {
  get: string;
  parameters: {
    id: string;
  };
  errors: any[]; // Replace any with a more specific error type if possible
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: LeagueInfo[];
}

interface LeagueInfo {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: Season[];
}

interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: {
    fixtures: {
      events: boolean;
      lineups: boolean;
      statistics_fixtures: boolean;
      statistics_players: boolean;
    };
    standings: boolean;
    players: boolean;
    top_scorers: boolean;
    top_assists: boolean;
    top_cards: boolean;
    injuries: boolean;
    predictions: boolean;
    odds: boolean;
  };
}


