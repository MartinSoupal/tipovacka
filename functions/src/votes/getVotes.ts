import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {Vote} from './types';

interface Request extends CustomRequest {
  body: {
    matchIds: string[]
  }
}

export async function getVotes(req: Request, res: any) {
  if (!req.body.matchIds.length) {
    res.status(200).send(JSON.stringify([]));
    return;
  }

  const snapshot =
    await db.collection('votes')
      .where('matchId', 'in', req.body.matchIds)
      .where('userUid', '==', req.userUid)
      .get();
  const votes: Vote[] = snapshot.docs.map(
    (doc) => {
      const data = doc.data();
      return {
        matchId: data.matchId,
        result: data.result,
      };
    }
  );
  res.status(200).send(JSON.stringify(votes));
}
