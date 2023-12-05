import {MatchResult} from './match.model';

export interface Vote {
  id: string;
  matchId: string;
  result: MatchResult;
}
