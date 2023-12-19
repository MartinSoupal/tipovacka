import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {UserLeagueData, UserLeagueForUser} from './types';

export async function getUserLeagues(req: CustomRequest, res: any) {
  const snapshot =
    await db.collection('userLeagues')
      .where('users', 'array-contains', req.userUid)
      .get();
  const adminSnapshot =
    await db.collection('userLeagues')
      .where('admins', 'array-contains', req.userUid)
      .get();
  const ids: string[] = [];
  const userLeagues: UserLeagueForUser[] = snapshot.docs.map(
    (doc) => {
      const data = doc.data() as UserLeagueData;
      ids.push(doc.id);
      return {
        id: doc.id,
        name: data.name,
        startedDate: data.startedDate ? data.startedDate.toDate() : null,
        leagues: data.leagues,
        isAdmin: data.admins.indexOf(req.userUid) !== -1,
        isUser: data.users.indexOf(req.userUid) !== -1,
      };
    }
  );
  adminSnapshot.docs.forEach(
    (doc) => {
      const data = doc.data() as UserLeagueData;
      if (ids.indexOf(doc.id) === -1) {
        userLeagues.push({
          id: doc.id,
          name: data.name,
          startedDate: data.startedDate ? data.startedDate.toDate() : null,
          leagues: data.leagues,
          isAdmin: true,
          isUser: false,
        });
      }
    }
  );
  res.status(200).send(JSON.stringify(userLeagues));
}
