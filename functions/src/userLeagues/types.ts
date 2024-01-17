import admin = require('firebase-admin');

export interface UserLeague extends UserLeagueData {
  id: string;
}

export interface UserLeagueData {
  name: string;
  admins: string[];
  users: string[];
  startedDate: admin.firestore.Timestamp;
  leagues: string[];
}

export interface UserLeagueForUser {
  id: string;
  name: string;
  startedDate: Date | null;
  leagues: string[];
  isAdmin: boolean;
  isUser: boolean;
}
