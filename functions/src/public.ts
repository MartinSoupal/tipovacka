import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {getMatches} from './matches/getMatches';
import {getTeams} from './teams/getTeams';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.get('/teams', getTeams);
app.get('/matches', getMatches);

export const publicApi = functions.https.onRequest(app);
