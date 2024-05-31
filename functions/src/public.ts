import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {
  calculateStanding,
  getLastStandingCalculationDate,
  getStandings,
} from './standings/getStandings';
import {getNextFixtures, getPrevFixtures} from './fixtures/getFixtures';
import {getLeagues} from './leagues/getLeagues';
import {getSeasons} from './seasons/getSeasons';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.get('/standings', getStandings);
app.get('/standings/calculationDate', getLastStandingCalculationDate);
app.get('/fixtures/next/test', getNextFixtures);
app.get('/fixtures/prev/test', getPrevFixtures);
app.get('/leagues/test', getLeagues);
app.get('/seasons', getSeasons);

app.post('/standings/calculate', calculateStanding);

export const publicApi = functions.https.onRequest(app);
