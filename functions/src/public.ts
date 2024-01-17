import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {getTeams} from './teams/getTeams';
import {getNextMatches, getPrevMatches} from './matches/getMatches';
import {
  getStandings,
  getStandingsForUserLeague,
} from './standings/getStandings';
import {getUserLeague} from './userLeagues/getUserLeague';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.get('/teams', getTeams);
app.get('/matches/prev', getPrevMatches);
app.get('/matches/next', getNextMatches);
app.get('/standings', getStandings);
app.get('/standings/:userLeague', getStandingsForUserLeague);
app.get('/user-league/:userLeagueId', getUserLeague);

export const publicApi = functions.https.onRequest(app);
