import admin = require('firebase-admin');

export interface Match {
  id: string;
  home: string;
  away: string;
  datetime: Date;
  round: string;
  result: number;
}

export interface NewMatch {
  home: string;
  away: string;
  datetime: admin.firestore.Timestamp;
  round: number;
  result: string;
}
