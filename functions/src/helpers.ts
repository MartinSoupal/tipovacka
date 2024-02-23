import {auth, db} from './firebaseConfig';
import axios, {AxiosResponse} from 'axios';
import {FixtureApiResponse, StaningsApiResponse} from './types';

export async function getDisplayName(uid: string) {
  try {
    const user = await auth.getUser(uid);
    return user.displayName || '';
  } catch (error) {
    console.error(`Error fetching user with uid ${uid}:`, error);
    return '';
  }
}

export async function getFixturesFromTo(from: string, to: string)
  : Promise<AxiosResponse<FixtureApiResponse>[]> {
  const leagues = (await db.collection('leagues').get())
    .docs
    .map(
      (leagueRef) => ({
        id: leagueRef.id,
        currentSeason: leagueRef
          .data()
          .seasons[leagueRef.data().seasons.length - 1],
      })
    );
  return Promise.all(
    leagues.map(
      (league) => axios.get(
        `https://v3.football.api-sports.io/fixtures?from=${from}&to=${to}&league=${league.id}&season=${league.currentSeason}`,
        {
          headers: {
            'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        }
      )
    )
  );
}

export async function getFixturesForDate(date: string)
  : Promise<AxiosResponse<FixtureApiResponse>[]> {
  const leagues = (await db.collection('leagues').get())
    .docs
    .map(
      (leagueRef) => ({
        id: leagueRef.id,
        currentSeason: leagueRef
          .data()
          .seasons[leagueRef.data().seasons.length - 1],
      })
    );
  return Promise.all(
    leagues.map(
      (league) => axios.get(
        `https://v3.football.api-sports.io/fixtures?date=${date}&league=${league.id}&season=${league.currentSeason}`,
        {
          headers: {
            'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        }
      )
    )
  );
}

export async function getLeaguesStanding()
  : Promise<AxiosResponse<StaningsApiResponse>[]> {
  const leagues = (await db.collection('leagues').get())
    .docs
    .map(
      (leagueRef) => ({
        id: leagueRef.id,
        currentSeason: leagueRef
          .data()
          .seasons[leagueRef.data().seasons.length - 1],
      })
    );
  return Promise.all(
    leagues.map(
      (league) => axios.get(
        `https://v3.football.api-sports.io/standings?league=${league.id}&season=${league.currentSeason}`,
        {
          headers: {
            'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        }
      )
    )
  );
}
