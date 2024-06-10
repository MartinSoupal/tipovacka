import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {validateFirebaseToken} from './validateFirebaseToken';
import {addVote} from './votes/addVote';
import {getVotes} from './votes/getVotes';
import {addUserLeague} from './userLeagues/addUserLeague';
import {getUserLeagues} from './userLeagues/getUserLeagues';
import {deleteVote} from './votes/deleteVote';
import {deleteUserLeague} from './userLeagues/deleteUserLeague';
import {joinUserLeague} from './userLeagues/joinUserLeague';
import {leaveUserLeague} from './userLeagues/leaveUserLeague';
import {removeUserFromUserLeague} from './userLeagues/removeUserFromUserLeague';
import {getUserLeagueUsers} from './userLeagues/getUserLeagueUsers';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(validateFirebaseToken);

// user
app.post('/vote', addVote);
app.delete('/vote/:matchId', deleteVote);
app.post('/votes', getVotes);
app.post('/user-league', addUserLeague);
app.get('/user-league/all', getUserLeagues);
app.delete('/user-league/:userLeagueId', deleteUserLeague);
app.post('/user-league/:userLeagueId/join', joinUserLeague);
app.post('/user-league/:userLeagueId/leave', leaveUserLeague);
app.get('/user-league/:userLeagueId/users', getUserLeagueUsers);
app.patch(
  '/user-league/:userLeagueId/leave/:userUid',
  removeUserFromUserLeague
);

export const privateApi = functions.https.onRequest(app);
