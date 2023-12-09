export interface Vote {
  id: string;
  matchId: string;
  result: VoteResult;
}

export type VoteResult = 0 | 1 | 2;
