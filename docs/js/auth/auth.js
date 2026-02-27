// ── Auth state (globals used by all modules) ────────────────────────────
let currentUser = null;   // display name
let currentEmail = null;  // email address
let isAdmin = false;

// ── Auth module ─────────────────────────────────────────────────────────
const Auth = {
  async handleLogin() {
    const email = document.getElementById('username').value.trim();
    const pass  = document.getElementById('password').value;
    const err   = document.getElementById('loginError');
    err.style.display = 'none';

    if (!email || !pass) {
      err.textContent = 'יש להזין מייל וסיסמה';
      err.style.display = 'block';
      return;
    }

    try {
      const cred = await fbAuth.signInWithEmailAndPassword(email, pass);
      await Auth._onSignedIn(cred.user);
    } catch (e) {
      document.getElementById('password').value = '';
      err.textContent = 'מייל או סיסמה שגויים';
      err.style.display = 'block';
    }
  },

  async _onSignedIn(fbUser) {
    const err = document.getElementById('loginError');
    // Check allowed_users collection
    const userDoc = await fbDb.collection('users').doc(fbUser.uid).get();

    // Bootstrap: if no users exist yet, make this user the first admin
    if (!userDoc.exists) {
      const anyUser = await fbDb.collection('users').limit(1).get();
      if (anyUser.empty) {
        await fbDb.collection('users').doc(fbUser.uid).set({
          email:       fbUser.email,
          displayName: fbUser.email.split('@')[0],
          role:        'admin',
          active:      true,
          createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
        });
        return Auth._onSignedIn(fbUser); // re-enter after creation
      }
      // User exists in Auth but not in allowed list
      await fbAuth.signOut();
      err.textContent = 'אין לך הרשאת גישה למערכת';
      err.style.display = 'block';
      return;
    }

    const data = userDoc.data();
    if (!data.active) {
      await fbAuth.signOut();
      err.textContent = 'החשבון שלך מושהה. פנה למנהל';
      err.style.display = 'block';
      return;
    }

    currentUser  = data.displayName || fbUser.email;
    currentEmail = fbUser.email;
    isAdmin      = data.role === 'admin';

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display     = 'block';
    document.getElementById('password').value            = '';
    App.initApp();
  },

  async handleLogout() {
    await fbAuth.signOut();
    currentUser  = null;
    currentEmail = null;
    isAdmin      = false;
    document.getElementById('mainApp').style.display     = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('username').value            = '';
    document.getElementById('password').value            = '';
    document.getElementById('loginError').style.display  = 'none';
  },

  restoreSession() {
    // Firebase restores session automatically via onAuthStateChanged
    fbAuth.onAuthStateChanged(async fbUser => {
      if (fbUser && !currentUser) {
        await Auth._onSignedIn(fbUser);
      }
    });
  },
};

// ── Global event listeners ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none')
    Auth.handleLogin();
  if (e.key === 'Escape') {
    PdfViewer.closeModal();
    AdminPanel.closeConfirm();
    SearchModal.close();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  Auth.restoreSession();
});
