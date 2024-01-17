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

export async function leaveUserLeague(req: Request, res: any) {
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
  if (userLeagueData.users.indexOf(req.userUid) === -1) {
    res.status(404).send('Not in the league of friends');
    return;
  }
  await userLeagueSnapshot.ref.update({
    users: FieldValue.arrayRemove(req.userUid),
  });
  res.status(200).send();
}
