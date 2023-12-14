import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {UserLeagueData, UserLeagueForUser} from './types';

interface Request extends CustomRequest {
  params: {
    userLeagueId: string;
  },
}

export async function getUserLeague(req: Request, res: any) {
  const snapshot =
    await db.collection('userLeagues')
      .doc(req.params.userLeagueId)
      .get();
  const data = snapshot.data() as UserLeagueData;
  const userLeague: UserLeagueForUser = {
    id: snapshot.id,
    name: data.name,
    startedDate: data.startedDate ? data.startedDate.toDate() : null,
    leagues: data.leagues,
    hasAdminRights: data.admins.indexOf(req.userUid) !== -1,
  };
  res.status(200).send(JSON.stringify(userLeague));
}
