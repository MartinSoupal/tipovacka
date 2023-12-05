import admin = require('firebase-admin');

export interface Match {
  id: string;
  home: string;
  away: string;
  datetime: Date;
  stage: string;
  round: string;
  result: number | null;
  league: string;
  0: number;
  1: number;
  2: number;
  postponed: boolean;
}

export interface NewMatch {
  home: string;
  away: string;
  datetime: admin.firestore.Timestamp;
  stage: string;
  round: string;
  result: number | null;
  league: string;
  0: number;
  1: number;
  2: number;
  postponed: boolean;
}
