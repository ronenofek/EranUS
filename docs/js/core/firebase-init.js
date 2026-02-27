// ── Firebase Initialization ──────────────────────────────────────────────────
// Uses Firebase compat SDK (loaded via CDN in index.html)

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBfFFZaiuqe9SFfNlDofb3pwKwliH4FHLo",
  authDomain:        "eranus-36ae6.firebaseapp.com",
  projectId:         "eranus-36ae6",
  storageBucket:     "eranus-36ae6.firebasestorage.app",
  messagingSenderId: "306103794826",
  appId:             "1:306103794826:web:64cd4e58eb6655d256c173"
};

firebase.initializeApp(FIREBASE_CONFIG);

// Primary app — used for all normal operations
const fbAuth = firebase.auth();
const fbDb   = firebase.firestore();

// Secondary app — used by admin to create new users without signing out
const _fbSecondary     = firebase.initializeApp(FIREBASE_CONFIG, 'secondary');
const fbSecondaryAuth  = _fbSecondary.auth();
