import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {addMatch} from './matches/addMatch';
import {validateFirebaseToken} from './validateFirebaseToken';
import {deleteMatch} from './matches/deleteMatch';
import {addVote} from './votes/addVote';
import {getVotes} from './votes/getVotes';
import {getAllMatches} from './matches/getMatches';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(validateFirebaseToken);

app.get('/match/all', getAllMatches);
app.post('/match', addMatch);
app.delete('/match/:matchId', deleteMatch);
app.post('/vote', addVote);
app.post('/votes', getVotes);

export const privateApi = functions.https.onRequest(app);
