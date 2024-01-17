import {auth} from './firebaseConfig';

export const validateFirebaseToken = async (req: any, res: any, next: any) => {
  console.log('Check if request is authorized with Firebase ID token');
  if (
    (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      'No Firebase ID token was passed as a Bearer token header.',
      'Make sure you authorize your request by providing header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }
  let idToken: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }
  try {
    const decodedIdToken = await auth.verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);
    req.userUid = decodedIdToken.uid;
    req.admin = decodedIdToken.email === 'm.soupal.06@gmail.com';
    next();
    return;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};
