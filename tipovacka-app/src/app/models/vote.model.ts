export interface Vote {
  matchId: string;
  result: VoteResult;
}

export type VoteResult = 0 | 1 | 2;
