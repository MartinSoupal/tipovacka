import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {getTeams} from './teams/teams';
import {addMatch, getMatches} from './matches/matches';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.get('/teams', getTeams);
app.get('/matches', getMatches);
app.post('/match', addMatch);

exports.api = functions.https.onRequest(app);
