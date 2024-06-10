import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';
import axios from 'axios';

export async function getLeagues(req: CustomRequest, res: any) {
  res.set('Cache-Control', 'public, max-age=86400');
  const leagues = await Promise.all(
    (await db.collection('leagues').get())
      .docs
      .map(
        async (leagueRef) => ({
          id: Number(leagueRef.id),
          name: (await axios.get(
            `https://v3.football.api-sports.io/leagues?id=${leagueRef.id}`,
            {
              headers: {
                'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
                'x-rapidapi-host': 'v3.football.api-sports.io',
              },
            }
          )).data.response[0].league.name,
          color: leagueRef.data().color,
        })
      )
  );
  res.status(200).send(JSON.stringify(leagues.sort((a, b) => a.id - b.id)));
}
