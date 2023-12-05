import {db} from '../firebaseConfig';
import {CustomRequest} from '../types';

interface Request extends CustomRequest {
  body: {
    name: string;
    startedDate: Date | null;
    leagues: [];
  }
}

export async function addUserLeague(req: Request, res: any) {
  const userUid = req.userUid;
  void await db.collection('userLeagues').add({
    ...req.body,
    admins: [userUid],
    users: [userUid],
  });
}
