const { initializeApp, cert, getApps, getApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

function getFirebaseApp() {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    })
  });
}

function verifyFirebaseIdToken(idToken) {
  return getAuth(getFirebaseApp()).verifyIdToken(idToken);
}

module.exports = { verifyFirebaseIdToken };
