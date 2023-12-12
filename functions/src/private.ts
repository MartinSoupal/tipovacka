import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {addMatch} from './matches/addMatch';
import {validateFirebaseToken} from './validateFirebaseToken';
import {deleteMatch} from './matches/deleteMatch';
import {addVote} from './votes/addVote';
import {getVotes} from './votes/getVotes';
import {getAllMatches} from './matches/getMatches';
import {editMatch} from './matches/editMatch';
import {getLeagues} from './leagues/getLeagues';
import {addUserLeague} from './userLeagues/addUserLeague';
import {getUserLeagues} from './userLeagues/getUserLeagues';
import {deleteVote} from './votes/deleteVote';
import {deleteUserLeague} from './userLeagues/deleteUserLeague';
import {joinUserLeague} from './userLeagues/joinUserLeague';
import {leaveUserLeague} from './userLeagues/leaveUserLeague';
import {removeUserFromUserLeague} from './userLeagues/removeUserFromUserLeague';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(validateFirebaseToken);

// admin
app.get('/match/all', getAllMatches);
app.post('/match', addMatch);
app.delete('/match/:matchId', deleteMatch);
app.patch('/match/:matchId', editMatch);
app.get('/leagues/all', getLeagues);

// user
app.post('/vote', addVote);
app.delete('/vote/:matchId', deleteVote);
app.post('/votes', getVotes);
app.post('/user-league', addUserLeague);
app.get('/user-league/all', getUserLeagues);
app.delete('/user-league/:userLeagueId', deleteUserLeague);
app.post('/user-league/:userLeagueId/join', joinUserLeague);
app.post('/user-league/:userLeagueId/leave', leaveUserLeague);
app.patch('/user-league/:userLeagueId/remove-user', removeUserFromUserLeague);

export const privateApi = functions.https.onRequest(app);
