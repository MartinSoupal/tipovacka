import {auth} from './firebaseConfig';
import axios, {AxiosResponse} from 'axios';
import {ApiResponse} from './types';

export async function getDisplayName(uid: string) {
  try {
    const user = await auth.getUser(uid);
    return user.displayName || '';
  } catch (error) {
    console.error(`Error fetching user with uid ${uid}:`, error);
    return '';
  }
}

export function getFixturesFromTo(from: string, to: string)
  : Promise<AxiosResponse<ApiResponse>[]> {
  return Promise.all([
    axios.get(
      `https://v3.football.api-sports.io/fixtures?from=${from}&to=${to}&league=39&season=2023`,
      {
        headers: {
          'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    ),
    axios.get(
      `https://v3.football.api-sports.io/fixtures?from=${from}&to=${to}&league=345&season=2023`,
      {
        headers: {
          'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    ),
  ]);
}

export function getFixturesForDate(date: string)
  : Promise<AxiosResponse<ApiResponse>[]> {
  return Promise.all([
    axios.get(
      `https://v3.football.api-sports.io/fixtures?date=${date}&league=39&season=2023`,
      {
        headers: {
          'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    ),
    axios.get(
      `https://v3.football.api-sports.io/fixtures?date=${date}&league=345&season=2023`,
      {
        headers: {
          'x-rapidapi-key': '2fc16db4f9181866ca4b0acea6ea6ca8',
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    ),
  ]);
}
