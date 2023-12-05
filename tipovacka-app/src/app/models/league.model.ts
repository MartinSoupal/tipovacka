export interface League {
  id: string;
  name: string;
  stages: LeagueStage[];
}

export interface LeagueStage {
  name: string;
  rounds: string[]
}
