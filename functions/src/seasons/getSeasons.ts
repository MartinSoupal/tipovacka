import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

export async function getSeasons(req: CustomRequest, res: any) {
  res.set('Cache-Control', 'public, max-age=86400');
  const leagues = ((await db.collection('general')
    .doc('all')
    .get())
    .data()?.seasons || []) as number[];
  res.status(200).send(JSON.stringify(leagues));
}
