import {db} from '../firebaseConfig';
import {League} from './types';

export async function getLeagues(req: any, res: any) {
  const snapshot = await db.collection('leagues').get();
  const leagues: League[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    leagues.push({
      id: doc.id,
      name: data.name,
      stages: data.stages,
    });
  });
  res.status(200).send(JSON.stringify(leagues));
}
