export type League = {
  id: string;
  name: string;
  stages: LeagueStage[];
}

export type LeagueStage = {
  id: string;
  name: string;
  rounds: string[];
}
