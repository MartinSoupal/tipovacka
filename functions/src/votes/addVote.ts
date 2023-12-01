import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

interface Request extends CustomRequest {
  body: {
    matchId: string;
    result: number | null;
  }
}

export async function addVote(req: Request, res: any) {
  const {matchId, result} = req.body;
  const userUid = req.userUid;
  if (
    !Number.isInteger(result) &&
    !(result === null || (result >= 0 && result <= 2))
  ) {
    res.status(400).send();
    return;
  }
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
  res.status(200).send();
  const voteSnapshot =
    await db.collection('votes')
      .where('matchId', '==', matchId)
      .where('userUid', '==', userUid)
      .get();
  if (voteSnapshot.empty && result !== null) {
    await matchSnapshot.ref.update({
      [result]: (match[result] || 0) + 1,
    });
    void await db.collection('votes').add({
      ...req.body,
      userUid: userUid,
    });
  } else {
    const voteDoc = voteSnapshot.docs.at(0)!;
    const vote = voteDoc.data();
    if (vote.result === result) {
      return;
    }
    if (result !== null) {
      await matchSnapshot.ref.update({
        [vote.result]: match[vote.result] - 1,
        [result]: (match[result] || 0) + 1,
      });
      await voteDoc.ref.update({result});
      return;
    } else {
      await matchSnapshot.ref.update({
        [vote.result]: match[vote.result] - 1,
      });
      await voteDoc.ref.delete();
      return;
    }
  }
}
