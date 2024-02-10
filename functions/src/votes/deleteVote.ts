import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

interface Request extends CustomRequest {
  params: {
    matchId: string;
  }
}

export async function deleteVote(req: Request, res: any) {
  const matchId = Number(req.params.matchId);
  const userUid = req.userUid;
  const voteSnapshot =
    await db.collection('votes')
      .where('matchId', '==', matchId)
      .where('userUid', '==', userUid)
      .get();
  if (voteSnapshot.empty) {
    res.status(404).send();
    return;
  }
  const voteDoc = voteSnapshot.docs.at(0)!;
  await voteDoc.ref.delete();
  res.status(200).send();
}
