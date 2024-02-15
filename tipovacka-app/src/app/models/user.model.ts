export interface User extends UserBase {
  uid: string;
  name: string;
  points: number;
  leagues: Record<string, UserBase>;
}

interface UserBase {
  correctVotes: number;
  incorrectVotes: number;
}
