import {db} from '../firebaseConfig';
import {CustomRequest, FixtureResponse, Score, Standing} from '../types';
import {
  getFixturesFromTo,
  getFixturesFromToForLeague,
  getLeagueCurrentSeason,
  getLeaguesStanding,
} from '../helpers';

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
  const twoWeeksFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
  goals: number;
  form?: string;
  rank?: number;
}

function fixtureDto2Fixture(
  dto: FixtureResponse,
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

interface FixtureForLeagueRequest extends CustomRequest {
  params: {
    leagueId: string;
  }
}

export async function getFixturesForLeague(req: FixtureForLeagueRequest, res: any) {
  const leagueId = Number(req.params.leagueId);

  const today = new Date()
    .toISOString()
    .substring(0, 10);
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substring(0, 10);
  const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000))
    .toISOString()
    .substring(0, 10);
  const oneWeekBeforeNow = new Date(Date.now() - (8 * 24 * 60 * 60 * 1000))
    .toISOString()
    .substring(0, 10);

  const currentSeason = await getLeagueCurrentSeason(leagueId);

  const previousFixtures = await getFixturesFromToForLeague(oneWeekBeforeNow, yesterday, leagueId, currentSeason);
  const nextFixtures = await getFixturesFromToForLeague(today, oneWeekFromNow, leagueId, currentSeason);

  const teamIdsSet = new Set<number>();

  [...previousFixtures, ...nextFixtures].forEach((fixture) => {
    teamIdsSet.add(fixture.teams.home.id);
    teamIdsSet.add(fixture.teams.away.id);
  });


  const fixtures: { prev: Fixture2[], next: Fixture2[] } = {
    prev: previousFixtures
      .filter(
        (fixture) => ['FT', 'AET', 'PEN'].indexOf(fixture.fixture.status.short) !== -1
      )
      .map(
        (fixture): Fixture2 => fixtureDto2Fixture2(fixture)
      ),
    next: nextFixtures
      .filter(
        (fixture) => ['TBD', 'NS'].indexOf(fixture.fixture.status.short) !== -1
      )
      .map(
        (fixture): Fixture2 => fixtureDto2Fixture2(fixture)
      ),
  };

  res.status(200).send(JSON.stringify(fixtures));
}

interface Fixture2 {
  id: number;
  date: Date;
  leagueName: string;
  round: string;
  season: number;
  homeTeam: Team2;
  awayTeam: Team2;
  result: 0 | 1 | 2 | null;
  status: string;
  score: Score;
}

interface Team2 {
  id: number;
  name: string;
}

function fixtureDto2Fixture2(dto: FixtureResponse): Fixture2 {
  const now = new Date();
  return {
    id: dto.fixture.id,
    date: new Date(dto.fixture.date),
    leagueName: dto.league.name,
    round: dto.league.round,
    season: dto.league.season,
    status: dto.fixture.status.short,
    score: dto.score,
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
    },
    awayTeam: {
      id: dto.teams.away.id,
      name: dto.teams.away.name,
    },
  };
}
