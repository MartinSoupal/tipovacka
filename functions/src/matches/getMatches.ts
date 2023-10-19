import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import {Match} from './types';

export async function getMatches(req: CustomRequest, res: any) {
  const snapshot = await db.collection('matches').get();
  const matches: Match[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    matches.push({
      id: doc.id,
      home: data.home,
      away: data.away,
      datetime: data.datetime.toDate(),
      round: data.round,
      result: data.result,
      0: data[0],
      1: data[1],
      2: data[2],
    });
  });
  res.status(200).send(JSON.stringify(matches));
}
