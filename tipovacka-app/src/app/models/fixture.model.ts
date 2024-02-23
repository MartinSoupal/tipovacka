export interface Fixture {
  id: string;
  date: Date;
  leagueName: string;
  round: string;
  season: number;
  homeTeam: Team;
  awayTeam: Team;
  result: 0 | 1 | 2 | null;
}

interface Team {
  id: string;
  name: string;
  color: string;
  goals: number;
  form: string;
  rank: number;
}
