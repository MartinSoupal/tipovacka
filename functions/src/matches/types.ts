import admin = require('firebase-admin');

export interface Match {
  id: string;
  home: string;
  away: string;
  datetime: Date;
  round: string;
  result: number | null;
  0: number;
  1: number;
  2: number;
}

export interface NewMatch {
  home: string;
  away: string;
  datetime: admin.firestore.Timestamp;
  round: number;
  result: number | null;
}
