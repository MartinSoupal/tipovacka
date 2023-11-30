import {db} from '../firebaseConfig';
import {NewMatch} from './types';
import {CustomRequest} from '../types';
import admin = require('firebase-admin');

interface Request extends CustomRequest {
  body: {
    home: string;
    away: string;
    datetime: string;
    stage: string;
    round: string;
    league: string;
    0: number;
    1: number;
    2: number;
  }
}

export async function addMatch(req: Request, res: any) {
  if (!req.admin) {
    res.status(403).send('Unauthorized');
    return;
  }
  const newMatch: NewMatch = {
    home: req.body.home,
    away: req.body.away,
    stage: req.body.stage,
    round: req.body.round,
    datetime: admin.firestore.Timestamp.fromDate(new Date(req.body.datetime)),
    result: null,
    league: req.body.league,
    0: 0,
    1: 0,
    2: 0,
  };
  const ress = await db.collection('matches').add(newMatch);
  res.status(200).send({id: ress.id});
}
