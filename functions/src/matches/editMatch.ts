import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {NewMatch} from './types';
import admin = require('firebase-admin');

interface Request extends CustomRequest {
  body: {
    datetime: string;
    result: number;
    postponed: boolean;
  };
  params: {
    matchId: string;
  }
}

export async function editMatch(req: Request, res: any) {
  if (!req.admin) {
    res.status(403).send('Unauthorized');
    return;
  }
  const editedMatch: Partial<NewMatch> = {};
  if (req.body.datetime !== undefined) {
    editedMatch.datetime =
      admin.firestore.Timestamp.fromDate(new Date(req.body.datetime));
  }
  if (req.body.result !== undefined) {
    editedMatch.result = req.body.result;
  }
  if (req.body.postponed !== undefined) {
    editedMatch.postponed = req.body.postponed;
  }
  void await db.collection('matches')
    .doc(req.params.matchId)
    .update(editedMatch);
  res.status(200).send();
}
