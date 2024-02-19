import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import admin = require('firebase-admin');

interface Request extends CustomRequest {
  body: {
    matchId: string;
    result: number;
  }
}

export async function addVote(req: Request, res: any) {
  const {matchId, result} = req.body;
  const userUid = req.userUid;
  if (
    !Number.isInteger(result) &&
    !(result >= 0 && result <= 2)
  ) {
    res.status(400).send();
    return;
  }
  const voteSnapshot =
    await db.collection('votes')
      .where('matchId', '==', matchId)
      .where('userUid', '==', userUid)
      .get();
  if (voteSnapshot.empty) {
    const ress = await db.collection('votes').add({
      ...req.body,
      userUid: userUid,
      datetime: admin.firestore.Timestamp.now(),
    });
    res.status(200).send({id: ress.id});
  } else {
    const voteDoc = voteSnapshot.docs.at(0)!;
    const vote = voteDoc.data();
    if (vote.result === result) {
      return;
    }
    await voteDoc.ref.update({
      result,
      datetime: admin.firestore.Timestamp.now(),
    });
    res.status(200).send();
  }
}
