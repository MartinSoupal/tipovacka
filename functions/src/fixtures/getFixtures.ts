import {db} from '../firebaseConfig';
import {CustomRequest, FixtureResponse, Standing} from '../types';
import {getFixturesFromTo, getLeaguesStanding} from '../helpers';

export async function getNextFixtures(req: CustomRequest, res: any) {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diffInSeconds =
    Math.round((endOfDay.getTime() - now.getTime()) / 1000) + 1;
  res.set('Cache-Control', `public, max-age=${diffInSeconds}`);
  const today = new Date()
    .toISOString()
    .substring(0, 10);
  const twoWeeksFromNow = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
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
  const allowTeamDetail: Record<string, boolean> = {};
  (await db.collection('leagues').get())
    .docs
    .forEach(
      (league) => {
        const data = league.data();
        allowTeamDetail[league.id] = data.allowTeamDetail;
      }
    );
  const fixtures: Fixture[] = [];
  responses.forEach(
    (response) => {
      response.data.response.forEach(
        (fixture) => {
          if (
            ['TBD', 'NS'].indexOf(fixture.fixture.status.short) !== -1
          ) {
            fixtures.push(
              fixtureDto2Fixture(
                fixture,
                teamsColorInHashMap,
                standingsHashMap,
                allowTeamDetail,
              )
            );
          }
        }
      );
    },
  );
  res.status(200).send(JSON.stringify(fixtures));
}

export async function getPrevFixtures(req: CustomRequest, res: any) {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diffInSeconds =
    Math.round((endOfDay.getTime() - now.getTime()) / 1000) + 1;
  res.set('Cache-Control', `public, max-age=${diffInSeconds}`);
  const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000))
    .toISOString()
    .substring(0, 10);
  const twoWeeksBeforeNow = new Date(Date.now() - (8 * 24 * 60 * 60 * 1000))
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
  const allowTeamDetail: Record<string, boolean> = {};
  (await db.collection('leagues').get())
    .docs
    .forEach(
      (league) => {
        const data = league.data();
        allowTeamDetail[league.id] = data.allowTeamDetail;
      }
    );
  const fixtures: Fixture[] = [];
  responses.forEach(
    (response) => {
      response.data.response.forEach(
        (fixture) => {
          if (
            ['FT', 'AET', 'PEN'].indexOf(fixture.fixture.status.short) !== -1
          ) {
            fixtures.push(
              fixtureDto2Fixture(
                fixture,
                teamsColorInHashMap,
                standingsHashMap,
                allowTeamDetail,
              )
            );
          }
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
  form?: string;
  rank?: number;
}

function fixtureDto2Fixture(
  dto: FixtureResponse,
  teamsColor: Record<string, string>,
  standingsHashMap: Record<string, Record<string, Standing>>,
  allowTeamDetail: Record<string, boolean>,
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
        Number(dto.score.fulltime.home) > Number(dto.score.fulltime.away) ?
          1 :
          Number(dto.score.fulltime.home) < Number(dto.score.fulltime.away) ?
            2 :
            0,
    homeTeam: {
      id: dto.teams.home.id,
      name: dto.teams.home.name,
      color: teamsColor[dto.teams.home.id],
      goals: dto.goals.home,
      form: allowTeamDetail[dto.league.id] ?
        standingsHashMap[dto.league.id][dto.teams.home.id]?.form :
        undefined,
      rank: allowTeamDetail[dto.league.id] ?
        standingsHashMap[dto.league.id][dto.teams.home.id]?.rank :
        undefined,
    },
    awayTeam: {
      id: dto.teams.away.id,
      name: dto.teams.away.name,
      color: teamsColor[dto.teams.away.id],
      goals: dto.goals.away,
      form: allowTeamDetail[dto.league.id] ?
        standingsHashMap[dto.league.id][dto.teams.away.id]?.form :
        undefined,
      rank: allowTeamDetail[dto.league.id] ?
        standingsHashMap[dto.league.id][dto.teams.away.id]?.rank :
        undefined,
    },
  };
}
