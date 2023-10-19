import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {addMatch} from './matches/addMatch';
import {validateFirebaseToken} from './validateFirebaseToken';
import {deleteMatch} from './matches/deleteMatch';

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(validateFirebaseToken);

app.post('/match', addMatch);
app.delete('/match/:matchId', deleteMatch);

export const privateApi = functions.https.onRequest(app);
