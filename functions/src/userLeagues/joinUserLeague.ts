import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {UserLeagueData} from './types';
import {firestore} from 'firebase-admin';
import FieldValue = firestore.FieldValue;

interface Request extends CustomRequest {
  params: {
    userLeagueId: string;
  },
}

export async function joinUserLeague(req: Request, res: any) {
  const userLeagueSnapshot =
    await db.collection('userLeagues')
      .doc(req.params.userLeagueId)
      .get();
  if (!userLeagueSnapshot.exists) {
    res.status(404).send('Bad request');
    return;
  }
  const userLeagueData =
    userLeagueSnapshot.data() as UserLeagueData;
  if (userLeagueData.users.indexOf(req.userUid) !== -1) {
    res.status(404).send('Already in league');
    return;
  }
  await userLeagueSnapshot.ref.update({
    users: FieldValue.arrayUnion(req.userUid),
  });
  res.status(200).send();
}
