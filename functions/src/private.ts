import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {validateFirebaseToken} from './validateFirebaseToken';
import {addVote} from './votes/addVote';
import {getVotes} from './votes/getVotes';
import {deleteVote} from './votes/deleteVote';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(validateFirebaseToken);

// user
app.post('/vote', addVote);
app.delete('/vote/:matchId', deleteVote);
app.post('/votes', getVotes);

export const privateApi = functions.https.onRequest(app);
