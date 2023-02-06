import * as admin from 'firebase-admin';

export const firebaseAdmin =
  // @ts-ignore
  (global.firebaseApp as admin.app.App) ??
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      privateKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY!.replace(
        /\\n/g,
        '\n'
      ),
      clientEmail: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
    }),
  });

// @ts-ignore
global.firebaseApp = firebaseAdmin;
