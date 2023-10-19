import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

interface Request extends CustomRequest {
  body: {
    matchId: string;
    result: number;
  }
}

export async function addVote(req: Request, res: any) {
  const matchSnapshot =
    await db.collection('matches').doc(req.body.matchId).get();
  if (!matchSnapshot.exists) {
    res.status(404).send();
    return;
  }
  const voteSnapshot =
    await db.collection('votes')
      .where('matchId', '==', req.body.matchId)
      .where('userUid', '==', req.userUid)
      .get();
  const match = matchSnapshot.data();
  if (!match) {
    res.status(404).send();
    return;
  }
  if (voteSnapshot.empty) {
    await matchSnapshot.ref.update({
      [req.body.result]: (match[req.body.result] || 0) + 1,
    });
    const ress = await db.collection('votes').add({
      ...req.body,
      userUid: req.userUid,
    });
    res.status(200).send({id: ress.id});
  } else {
    const voteDoc = voteSnapshot.docs.at(0)!;
    const vote = voteDoc.data();
    await matchSnapshot.ref.update({
      [vote.result]: match[vote.result] - 1,
      [req.body.result]: (match[req.body.result] || 0) + 1,
    });
    await voteDoc.ref.update({result: req.body.result});
    res.status(200).send({id: voteDoc.id});
  }
}
