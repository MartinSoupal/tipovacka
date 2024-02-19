export interface User extends UserBase {
  uid: string;
  name: string;
  points: number;
  seasons: Record<string, Record<string, UserBase>>;
}

interface UserBase {
  correctVotes: number;
  incorrectVotes: number;
}
