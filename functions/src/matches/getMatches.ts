import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {Match} from './types';
import admin = require('firebase-admin');

export async function getNextMatches(req: CustomRequest, res: any) {
  const now =
    admin.firestore.Timestamp.fromDate(
      new Date()
    ); // 14 days in milliseconds
  const twoWeeksFromNow =
    admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    ); // 14 days in milliseconds
  const snapshot = await db.collection('matches')
    .where('datetime', '>', now)
    .where('datetime', '<', twoWeeksFromNow)
    .get();
  if (snapshot.empty) {
    res.status(200).send(JSON.stringify([]));
    return;
  }
  const matches: Match[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    matches.push({
      id: doc.id,
      home: data.home,
      away: data.away,
      datetime: data.datetime.toDate(),
      stage: data.stage,
      round: data.round,
      result: data.result,
      league: data.league,
      0: data[0],
      1: data[1],
      2: data[2],
      postponed: data.postponed,
    });
  });
  res.status(200).send(JSON.stringify(matches));
}

export async function getPrevMatches(req: CustomRequest, res: any) {
  const twoWeeksBeforeNow =
    admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    ); // 14 days in milliseconds
  const now =
    admin.firestore.Timestamp.fromDate(
      new Date()
    ); // 14 days in milliseconds
  const snapshot = await db.collection('matches')
    .where('datetime', '>', twoWeeksBeforeNow)
    .where('datetime', '<', now)
    .where('postponed', '==', false)
    .get();
  if (snapshot.empty) {
    res.status(200).send(JSON.stringify([]));
    return;
  }
  const matches: Match[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    matches.push({
      id: doc.id,
      home: data.home,
      away: data.away,
      datetime: data.datetime.toDate(),
      stage: data.stage,
      round: data.round,
      result: data.result,
      league: data.league,
      0: data[0],
      1: data[1],
      2: data[2],
      postponed: data.postponed,
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
  if (snapshot.empty) {
    res.status(200).send(JSON.stringify([]));
    return;
  }
  const matches: Match[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    matches.push({
      id: doc.id,
      home: data.home,
      away: data.away,
      datetime: data.datetime.toDate(),
      stage: data.stage,
      round: data.round,
      result: data.result,
      league: data.league,
      0: data[0],
      1: data[1],
      2: data[2],
      postponed: data.postponed,
    });
  });
  res.status(200).send(JSON.stringify(matches));
}
