import {db} from '../firebaseConfig';
import {CustomRequest, FixtureResponse, Standing} from '../types';
import {getFixturesFromTo, getLeaguesStanding} from '../helpers';

export async function getNextFixtures(req: CustomRequest, res: any) {
  /*
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diffInSeconds =
    Math.round((endOfDay.getTime() - now.getTime()) / 1000) + 1;
  res.set('Cache-Control', `public, max-age=${diffInSeconds}`);
   */
  const today = new Date()
    .toISOString()
    .substring(0, 10);
  const twoWeeksFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substring(0, 10);
  const responses = await getFixturesFromTo(today, twoWeeksFromNow);
  const standingsResponses = await getLeaguesStanding();
  const standingsHashMap: Record<
    string,
    Record<string, Standing>
  > = {};
  standingsResponses.forEach(
    (standingsResponse) => {
      standingsResponse.data.response.forEach(
        (response) => {
          response.league.standings.forEach(
            (standing) => {
              standingsHashMap[response.league.id] = {};
              standing.forEach(
                (team) => {
                  standingsHashMap[response.league.id][team.team.id] = team;
                }
              );
            }
          );
        }
      );
    }
  );
  const teams = await db.collection('teams').get();
  const teamsColorInHashMap: Record<string, string> = {};
  teams.forEach(
    (team) => {
      const teamData = team.data();
      teamsColorInHashMap[team.id] = teamData.color;
    }
  );
  const fixtures: Fixture[] = [];
  responses.forEach(
    (response) => {
      response.data.response.forEach(
        (fixture) => {
          fixtures.push(
            fixtureDto2Fixture(
              fixture,
              teamsColorInHashMap,
              standingsHashMap,
            )
          );
        }
      );
    },
  );
  res.status(200).send(JSON.stringify(fixtures));
}

export async function getPrevFixtures(req: CustomRequest, res: any) {
  /*
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diffInSeconds =
    Math.round((endOfDay.getTime() - now.getTime()) / 1000) + 1;
  res.set('Cache-Control', `public, max-age=${diffInSeconds}`);
   */
  const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000))
    .toISOString()
    .substring(0, 10);
  const twoWeeksBeforeNow = new Date(Date.now() - (11 * 24 * 60 * 60 * 1000))
    .toISOString()
    .substring(0, 10);
  const responses = await getFixturesFromTo(twoWeeksBeforeNow, yesterday);
  const standingsResponses = await getLeaguesStanding();
  const standingsHashMap: Record<
    string,
    Record<string, Standing>
  > = {};
  standingsResponses.forEach(
    (standingsResponse) => {
      standingsResponse.data.response.forEach(
        (response) => {
          response.league.standings.forEach(
            (standing) => {
              standingsHashMap[response.league.id] = {};
              standing.forEach(
                (team) => {
                  standingsHashMap[response.league.id][team.team.id] = team;
                }
              );
            }
          );
        }
      );
    }
  );
  const teams = await db.collection('teams').get();
  const teamsColorInHashMap: Record<string, string> = {};
  teams.forEach(
    (team) => {
      const teamData = team.data();
      teamsColorInHashMap[team.id] = teamData.color;
    }
  );
  const fixtures: Fixture[] = [];
  responses.forEach(
    (response) => {
      response.data.response.forEach(
        (fixture) => {
          fixtures.push(
            fixtureDto2Fixture(
              fixture,
              teamsColorInHashMap,
              standingsHashMap,
            )
          );
        }
      );
    },
  );
  res.status(200).send(JSON.stringify(fixtures));
}

interface Fixture {
  id: number;
  date: Date;
  leagueName: string;
  round: string;
  season: number;
  homeTeam: Team;
  awayTeam: Team;
  result: 0 | 1 | 2 | null;
}

interface Team {
  id: number;
  name: string;
  color: string;
  goals: number;
  form: string;
  rank: number;
}

function fixtureDto2Fixture(
  dto: FixtureResponse,
  teamsColor: Record<string, string>,
  standingsHashMap: Record<string, Record<string, Standing>>
): Fixture {
  const now = new Date();
  return {
    id: dto.fixture.id,
    date: new Date(dto.fixture.date),
    leagueName: dto.league.name,
    round: dto.league.round,
    season: dto.league.season,
    result:
      now < new Date(dto.fixture.date) ?
        null :
        dto.teams.home.winner ?
          1 :
          dto.teams.away.winner ?
            2 :
            0,
    homeTeam: {
      id: dto.teams.home.id,
      name: dto.teams.home.name,
      color: teamsColor[dto.teams.home.id],
      goals: dto.goals.home,
      form: standingsHashMap[dto.league.id][dto.teams.home.id]?.form,
      rank: standingsHashMap[dto.league.id][dto.teams.home.id]?.rank,
    },
    awayTeam: {
      id: dto.teams.away.id,
      name: dto.teams.away.name,
      color: teamsColor[dto.teams.away.id],
      goals: dto.goals.away,
      form: standingsHashMap[dto.league.id][dto.teams.away.id]?.form,
      rank: standingsHashMap[dto.league.id][dto.teams.away.id]?.rank,
    },
  };
}
