import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {calculateStanding, getStandings} from './standings/getStandings';
import {getNextFixtures, getPrevFixtures} from './fixtures/getFixtures';
import {getLeagues} from './leagues/getLeagues';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.get('/standings', getStandings);
app.get('/fixtures/next2', getNextFixtures);
app.get('/fixtures/prev2', getPrevFixtures);
app.get('/leagues2', getLeagues);

app.post('/standings/calculate', calculateStanding);

export const publicApi = functions.https.onRequest(app);
