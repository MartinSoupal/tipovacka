import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {Match} from './types';
import admin = require('firebase-admin');

export async function getMatches(req: CustomRequest, res: any) {
  const now = admin.firestore.Timestamp.now();
  const twoWeeksFromNow =
    admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    ); // 14 days in milliseconds
  // 2. Use a range query with Fi
  const snapshot = await db.collection('matches')
    .where('datetime', '>', now)
    .where('datetime', '<', twoWeeksFromNow)
    .get();
  const matches: Match[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    matches.push({
      id: doc.id,
      home: data.home,
      away: data.away,
      datetime: data.datetime.toDate(),
      round: data.round,
      result: data.result,
      0: data[0],
      1: data[1],
      2: data[2],
    });
  });
  res.status(200).send(JSON.stringify(matches));
}

export async function getAllMatches(req: CustomRequest, res: any) {
  if (!req.admin) {
    res.status(403).send('Unauthorized');
    return;
  }
  const snapshot = await db.collection('matches').get();
  const matches: Match[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    matches.push({
      id: doc.id,
      home: data.home,
      away: data.away,
      datetime: data.datetime.toDate(),
      round: data.round,
      result: data.result,
      0: data[0],
      1: data[1],
      2: data[2],
    });
  });
  res.status(200).send(JSON.stringify(matches));
}
