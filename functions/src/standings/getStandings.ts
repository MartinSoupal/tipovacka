import {CustomRequest} from '../types';
import {auth, db} from '../firebaseConfig';
import {User} from './types';
import {Match} from '../matches/types';
import {UserLeagueData} from '../userLeagues/types';

export async function getStandings(req: CustomRequest, res: any) {
  const matchesSnapshot = await db.collection('matches').get();
  const votesSnapshot = await db.collection('votes').get();
  const matches: Record<string, Match> = {};
  matchesSnapshot.forEach(
    (doc) => {
      const data = doc.data();
      if (data.result !== null && !data.postponed) {
        matches[doc.id] = {
          id: doc.id,
          home: data.home,
          away: data.away,
          datetime: data.datetime.toDate(),
          round: data.round,
          result: data.result,
          league: data.league,
          stage: data.stage,
          0: data[0],
          1: data[1],
          2: data[2],
          postponed: data.postponed,
        };
      }
    }
  );
  const users: Record<string, [number, number]> = {};
  votesSnapshot.forEach(
    (doc) => {
      const vote = doc.data();
      if (!Object.prototype.hasOwnProperty.call(matches, vote.matchId)) {
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(users, vote.userUid)) {
        users[vote.userUid] = [0, 0];
      }
      users[vote.userUid][0]++;
      if (vote.result === matches[vote.matchId].result) {
        users[vote.userUid][1]++;
      }
    }
  );

  const standing: User[] = await Promise.all(
    Object.keys(users).map(
      async (key) => ({
        totalVotes: users[key][0],
        correctVotes: users[key][1],
        name: await getDisplayName(key),
      })
    )
  );
  res.status(200).send(JSON.stringify(standing));
}

interface Request extends CustomRequest {
  params: {
    userLeague: string;
  }
}

export async function getStandingsForUserLeague(req: Request, res: any) {
  const userLeagueSnapshot =
    await db.collection('userLeagues')
      .doc(req.params.userLeague)
      .get();
  if (!userLeagueSnapshot.exists) {
    res.status(404).send();
    return;
  }
  const userLeagueData =
    userLeagueSnapshot.data() as UserLeagueData;

  const matchesSnapshot =
    await db.collection('matches')
      .where('league', 'in', userLeagueData.leagues)
      .where('result', '!=', null)
      .where('postponed', '==', false)
      .get();
  const matchIds: string[] = [];
  const matches: Record<string, number | null> = {};
  matchesSnapshot.forEach(
    (doc) => {
      const data = doc.data();
      matches[doc.id] = data.result;
      matchIds.push(doc.id);
    }
  );

  if (!matchIds.length) {
    res.status(200).send(JSON.stringify([]));
  }

  const votesSnapshot =
    await db.collection('votes')
      .where('matchId', 'in', matchIds)
      .where('userUid', 'in', userLeagueData.users)
      .get();
  const users: Record<string, [number, number]> = {};
  userLeagueData.users.forEach(
    (user) => {
      users[user] = [0, 0];
    }
  );
  votesSnapshot.forEach(
    (doc) => {
      const vote = doc.data();
      users[vote.userUid][0]++;
      if (vote.result === matches[vote.matchId]) {
        users[vote.userUid][1]++;
      }
    }
  );

  const standing: User[] = await Promise.all(
    Object.keys(users).map(
      async (key) => ({
        totalVotes: users[key][0],
        correctVotes: users[key][1],
        name: await getDisplayName(key),
      })
    )
  );
  res.status(200).send(JSON.stringify(standing));
}

async function getDisplayName(uid: string) {
  try {
    const user = await auth.getUser(uid);
    return user.displayName || '';
  } catch (error) {
    console.error(`Error fetching user with uid ${uid}:`, error);
    return '';
  }
}
