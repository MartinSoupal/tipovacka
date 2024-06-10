import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

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
  const chunkSize = 30;
  const matchIds = req.body.matchIds;
  const userUid = req.userUid;
  const chunks = [];
  for (let i = 0; i < matchIds.length; i += chunkSize) {
    chunks.push(matchIds.slice(i, i + chunkSize));
  }
  const votesPromises = chunks.map((chunk) =>
    db.collection('votes')
      .where('matchId', 'in', chunk)
      .where('userUid', '==', userUid)
      .get()
  );
  const snapshots = await Promise.all(votesPromises);
  const votes = snapshots.flatMap((snapshot) =>
    snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        matchId: data.matchId,
        result: data.result,
      };
    })
  );
  res.status(200).send(JSON.stringify(votes));
}
