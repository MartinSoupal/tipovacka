import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {UserLeagueForUser} from './types';
import {League} from '../leagues/types';

export async function getUserLeagues(req: CustomRequest, res: any) {
  const snapshot =
    await db.collection('userLeagues')
      .where('users', 'array-contains', req.userUid)
      .get();
  const leagues: Record<string, League> = {};

  (await db.collection('leagues')
    .get())
    .forEach(
      (doc) => {
        const data = doc.data();
        leagues[doc.id] = {
          id: doc.id,
          name: data.name,
          stages: data.stages,
        };
      }
    );
  const userLeagues: UserLeagueForUser[] = snapshot.docs.map(
    (doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        startedDate: data.startedDate ? data.startedDate.toDate() : null,
        leagues: (data.leagues as string[])
          .map(
            (userLeague) => leagues[userLeague].name
          ),
      };
    }
  );
  res.status(200).send(JSON.stringify(userLeagues));
}
