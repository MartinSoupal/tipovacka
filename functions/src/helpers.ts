import {auth, db} from './firebaseConfig';
import axios, {AxiosResponse} from 'axios';
import {
  FixtureApiResponse,
  LeagueAPIResponse,
  StaningsApiResponse,
} from './types';

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
  const leagues = await getLeaguesWithCurrentSeason();
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
  const leagues = await getLeaguesWithCurrentSeason();
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
  const leagues = await getLeaguesWithCurrentSeason();
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

export async function getLeaguesWithCurrentSeason(): Promise<{
  id: number;
  currentSeason: number;
}[]> {
  const leaguesIds = (await db.collection('leagues').get())
    .docs
    .map((leagueRef) => leagueRef.id);
  const leaguesInfo = await Promise.all(
    leaguesIds.map(
      (leagueId): Promise<AxiosResponse<LeagueAPIResponse>> => axios.get(
        `https://v3.football.api-sports.io/leagues?id=${leagueId}`,
        {
          headers: {
            'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        }
      )
    )
  );
  const leagues: { id: number, currentSeason: number }[] = [];
  leaguesInfo.forEach(
    (leagueInfo) => {
      const id = leagueInfo.data.response[0].league.id;
      let currentSeason = 0;
      leagueInfo.data.response[0].seasons.forEach(
        (season) => {
          if (season.current) {
            currentSeason = season.year;
          }
        }
      );
      leagues.push({id, currentSeason});
    }
  );
  return leagues;
}
