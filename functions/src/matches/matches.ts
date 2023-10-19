import {db} from '../firebaseConfig';
import {Request} from 'express';
import admin = require('firebase-admin');

interface Match {
  id: string;
  home: string;
  away: string;
  datetime: Date;
  round: string;
  result: number;
}

export async function getMatches(req: any, res: any) {
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
    });
  });
  res.status(200).send(JSON.stringify(matches));
}


interface NewMatchRequest extends Request {
  body: {
    home: string;
    away: string;
    datetime: Date;
    round: number;
  }
}

interface NewMatch {
  home: string;
  away: string;
  datetime: admin.firestore.Timestamp;
  round: number;
  result: string;
}

export async function addMatch(req: NewMatchRequest, res: any) {
  const datetime = new Date(req.body.datetime);
  datetime.setHours(datetime.getHours() - 2);
  const newMatch: NewMatch = {
    home: req.body.home,
    away: req.body.away,
    round: req.body.round,
    datetime: admin.firestore.Timestamp.fromDate(datetime),
    result: '',
  };
  const ress = await db.collection('matches').add(newMatch);
  res.status(200).send({id: ress.id});
}
