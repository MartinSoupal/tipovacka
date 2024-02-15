import {CustomRequest, FixtureResponse} from '../types';
import {db} from '../firebaseConfig';
import {getDisplayName, getFixturesForDate} from '../helpers';

export async function getStandings(req: CustomRequest, res: any) {
  const standing =
    ((await db.collection('standings').doc('all').get()).data() as Standing)
      .data;

  const standingWithUserName = await Promise.all(
    Object.keys(standing).map(
      async (key) => ({
        uid: key,
        ...standing[key],
        name: await getDisplayName(key),
      })
    )
  );
  res.status(200).send(JSON.stringify(standingWithUserName));
}

interface Standing {
  lastCalculationDate: string;
  data: Record<string, StandingData>;
}

interface StandingData extends StandingDataBase {
  leagues: Record<string, StandingDataBase>
}

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
  const standingData: Record<string, StandingData> = standing.data;
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
  voteSnapshots.forEach(
    (votes) => {
      votes.forEach(
        (vote) => {
          const data = vote.data();
          const fixture = fixturesInHasMap[data.matchId];
          if (
            ['FT', 'AET', 'PEN'].indexOf(fixture.fixture.status.short) === -1
          ) {
            return;
          }
          if (
            !Object.prototype.hasOwnProperty
              .call(standingData, data.userUid)
          ) {
            standingData[data.userUid] = {
              correctVotes: 0,
              incorrectVotes: 0,
              leagues: {},
            };
          }
          if (
            !Object.prototype.hasOwnProperty
              .call(standingData[data.userUid].leagues, fixture.league.name)
          ) {
            standingData[data.userUid].leagues[fixture.league.name] = {
              correctVotes: 0,
              incorrectVotes: 0,
            };
          }
          let correct = false;
          switch (data.result) {
            case 1:
              if (fixture.teams.home.winner) {
                correct = true;
              }
              break;
            case 2:
              if (fixture.teams.away.winner) {
                correct = true;
              }
              break;
            case 0:
              if (
                !fixture.teams.home.winner &&
                !fixture.teams.away.winner
              ) {
                correct = true;
              }
              break;
          }
          if (correct) {
            standingData[data.userUid].correctVotes += 1;
            standingData[data.userUid]
              .leagues[fixture.league.name]
              .correctVotes += 1;
          } else {
            standingData[data.userUid].incorrectVotes += 1;
            standingData[data.userUid]
              .leagues[fixture.league.name]
              .incorrectVotes += 1;
          }
        }
      );
    }
  );
  await standingRef.ref.update({
    data: standingData,
    lastCalculationDate: yesterday,
  });
  res.status(200).send();
}
