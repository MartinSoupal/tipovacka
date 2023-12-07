export type League = {
  id: string;
  name: string;
  stages: LeagueStage[];
}

export type LeagueStage = {
  name: string;
  rounds: string[];
}
