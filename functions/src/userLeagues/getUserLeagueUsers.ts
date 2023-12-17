import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {UserLeagueData} from './types';
import {getDisplayName} from '../helpers';

interface Request extends CustomRequest {
  params: {
    userLeagueId: string;
  },
}

interface User {
  userUid: string;
  name: string;
  hasAdminRights: boolean;
}

export async function getUserLeagueUsers(req: Request, res: any) {
  const snapshot =
    await db.collection('userLeagues')
      .doc(req.params.userLeagueId)
      .get();
  const userLeagueData = snapshot.data() as UserLeagueData;
  if (userLeagueData.admins.indexOf(req.userUid) === -1) {
    res.status(403).send('Unauthorized');
    return;
  }
  const users: User[] = await Promise.all(userLeagueData.users.map(
    async (userUid) => ({
      userUid,
      name: await getDisplayName(userUid),
      hasAdminRights: userLeagueData.admins.indexOf(userUid) !== -1,
    })
  ));
  res.status(200).send(JSON.stringify(users));
}
