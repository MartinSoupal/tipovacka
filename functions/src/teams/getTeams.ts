import {db} from '../firebaseConfig';
import {Team} from './types';

export async function getTeams(req: any, res: any) {
  const snapshot = await db.collection('teams').get();
  const teams: Team[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    teams.push({
      id: doc.id,
      name: data.name,
      color: data.color,
    });
  });
  res.status(200).send(JSON.stringify(teams));
}
