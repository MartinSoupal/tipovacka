import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

interface Request extends CustomRequest {
  params: {
    matchId: string;
  }
}

export async function deleteVote(req: Request, res: any) {
  const matchId = req.params.matchId;
  const userUid = req.userUid;
  const matchSnapshot =
    await db.collection('matches').doc(matchId).get();
  if (!matchSnapshot.exists) {
    res.status(404).send();
    return;
  }
  const match = matchSnapshot.data();
  if (!match || match.datetime.toDate() < new Date()) {
    res.status(400).send();
    return;
  }
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
  const vote = voteDoc.data();
  await matchSnapshot.ref.update({
    [vote.result]: match[vote.result] - 1,
  });
  await voteDoc.ref.delete();
  res.status(200).send();
}
