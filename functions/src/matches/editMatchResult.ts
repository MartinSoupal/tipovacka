import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

interface Request extends CustomRequest {
  body: {
    result: number;
  };
  params: {
    matchId: string;
  }
}

export async function editMatchResult(req: Request, res: any) {
  if (!req.admin) {
    res.status(403).send('Unauthorized');
    return;
  }
  void await db.collection('matches')
    .doc(req.params.matchId)
    .update({result: req.body.result});
  res.status(200).send();
}
