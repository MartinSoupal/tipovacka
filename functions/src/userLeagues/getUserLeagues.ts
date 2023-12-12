import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {UserLeagueData, UserLeagueForUser} from './types';

export async function getUserLeagues(req: CustomRequest, res: any) {
  const snapshot =
    await db.collection('userLeagues')
      .where('users', 'array-contains', req.userUid)
      .get();
  const userLeagues: UserLeagueForUser[] = snapshot.docs.map(
    (doc) => {
      const data = doc.data() as UserLeagueData;
      return {
        id: doc.id,
        name: data.name,
        startedDate: data.startedDate ? data.startedDate.toDate() : null,
        leagues: data.leagues,
        hasAdminRights: data.admins.indexOf(req.userUid) !== -1,
      };
    }
  );
  res.status(200).send(JSON.stringify(userLeagues));
}
