import {CustomRequest, FixtureResponse} from '../types';
import {db} from '../firebaseConfig';
import {getDisplayName, getFixturesForDate} from '../helpers';

export async function getStandings(req: CustomRequest, res: any) {
  const now = new Date();
  const nextDay5AM = new Date(now);
  nextDay5AM.setDate(now.getDate() + 1);
  nextDay5AM.setHours(4, 20, 0, 0);
  const diffInSeconds =
    Math.round((nextDay5AM.getTime() - now.getTime()) / 1000);
  res.set('Cache-Control', `public, max-age=${diffInSeconds}`);
  const standing =
    ((await db.collection('standings').doc('all').get()).data() as Standing)
      .data;

  const standingWithUserName = await Promise.all(
    Object.keys(standing).map(
      async (key) => ({
        uid: key,
        seasons: standing[key],
        name: await getDisplayName(key),
      })
    )
  );
  res.status(200).send(JSON.stringify(standingWithUserName));
}

export interface Standing {
  lastCalculationDate: string;
  data: Record<string, StandingData>;
}

type StandingData = Record<string, Record<string, StandingDataBase>>;

interface StandingDataBase {
  correctVotes: number;
  incorrectVotes: number;
}

export async function calculateStanding(req: CustomRequest, res: any) {
  const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000))
    .toISOString()
    .substring(0, 10);
  const standingRef = await db.collection('standings').doc('all').get();
  const standing: Standing = standingRef.data()! as Standing;
  if (standing.lastCalculationDate === yesterday) {
    res.status(200).send();
    return;
  }
  const SD: Record<string, StandingData> = standing.data;
  const apiResponses = await getFixturesForDate(yesterday);
  const fixtureIds: number[] = [];
  const fixturesInHasMap: Record<string, FixtureResponse> = {};
  apiResponses.forEach(
    (apiResponse) => {
      apiResponse.data.response.forEach(
        (response) => {
          fixturesInHasMap[response.fixture.id] = response;
          fixtureIds.push(response.fixture.id);
        }
      );
    },
  );
  const chunkSize = 30;
  const chunks = [];
  for (let i = 0; i < fixtureIds.length; i += chunkSize) {
    chunks.push(fixtureIds.slice(i, i + chunkSize));
  }
  const votesPromises = chunks.map((chunk) =>
    db.collection('votes')
      .where('matchId', 'in', chunk)
      .get()
  );
  const voteSnapshots = await Promise.all(votesPromises);
  const seasons: number[] = [];
  voteSnapshots.forEach(
    (votes) => {
      votes.forEach(
        (vote) => {
          const voteData = vote.data();
          const fix = fixturesInHasMap[voteData.matchId];
          if (
            ['FT', 'AET', 'PEN'].indexOf(fix.fixture.status.short) !== -1
          ) {
            if (
              !Object.prototype.hasOwnProperty
                .call(SD, voteData.userUid)
            ) {
              SD[voteData.userUid] = {};
            }
            if (
              !Object.prototype.hasOwnProperty
                .call(SD[voteData.userUid], fix.league.season)
            ) {
              SD[voteData.userUid][fix.league.season] = {};
            }
            if (
              !Object.prototype.hasOwnProperty
                .call(
                  SD[voteData.userUid][fix.league.season],
                  fix.league.name
                )
            ) {
              SD[voteData.userUid][fix.league.season][fix.league.name] = {
                correctVotes: 0,
                incorrectVotes: 0,
              };
            }
            let correct = false;
            switch (voteData.result) {
              case 1:
                if (fix.score.fulltime.home! > fix.score.fulltime.away!) {
                  correct = true;
                }
                break;
              case 2:
                if (fix.score.fulltime.home! < fix.score.fulltime.away!) {
                  correct = true;
                }
                break;
              case 0:
                if (fix.score.fulltime.home === fix.score.fulltime.away) {
                  correct = true;
                }
                break;
              default:
                correct = false;
                break;
            }
            seasons.push(fix.league.season);
            if (correct) {
              SD[voteData.userUid][fix.league.season][fix.league.name]
                .correctVotes += 1;
            } else {
              SD[voteData.userUid][fix.league.season][fix.league.name]
                .incorrectVotes += 1;
            }
          }
        }
      );
    }
  );
  await db.collection('general').doc('all')
    .update({seasons: [...new Set(seasons)]});
  await standingRef.ref.update({
    data: SD,
    lastCalculationDate: yesterday,
  });
  res.status(200).send();
}

export async function getLastStandingCalculationDate(
  req: CustomRequest,
  res: any
) {
  const standingRef =
    await db.collection('standings').doc('all').get();
  const standing: Standing = standingRef.data()! as Standing;
  res.status(200).send(JSON.stringify({
    lastCalculationDate: standing.lastCalculationDate,
  }));
}
