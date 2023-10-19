import {db} from '../firebaseConfig';
import {NewMatch} from './types';
import {CustomRequest} from '../types';
import admin = require('firebase-admin');

interface Request extends CustomRequest {
  body: {
    home: string;
    away: string;
    datetime: Date;
    round: number;
  }
}

export async function addMatch(req: Request, res: any) {
  if (!req.admin) {
    res.status(403).send('Unauthorized');
    return;
  }
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
