import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

interface Request extends CustomRequest {
  params: {
    matchId: string;
  }
}

export async function deleteMatch(req: Request, res: any) {
  if (!req.admin) {
    res.status(403).send('Unauthorized');
    return;
  }
  await db.collection('matches').doc(req.params.matchId).delete();
  res.status(200).send();
}
