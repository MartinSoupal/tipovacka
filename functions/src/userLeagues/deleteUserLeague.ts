import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {UserLeagueData} from './types';

interface Request extends CustomRequest {
  params: {
    userLeagueId: string;
  }
}

export async function deleteUserLeague(req: Request, res: any) {
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
  if (userLeagueData.admins.indexOf(req.userUid) === -1) {
    res.status(403).send('Unauthorized');
    return;
  }
  void await userLeagueSnapshot.ref.delete();
  res.status(200).send();
}
