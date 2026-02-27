// ── Firestore-backed Storage ─────────────────────────────────────────────
// All data is now shared across users via Firestore.
// DEFAULT_MESSAGES / DEFAULT_DOCS remain in config.js (read-only).
// Custom content and deletion state live in Firestore collections.

const Storage = {

  // ── Read ──────────────────────────────────────────────────────────────

  async getMessages() {
    const [customSnap, cfgDoc] = await Promise.all([
      fbDb.collection('messages').orderBy('createdAt').get(),
      fbDb.collection('config').doc('defaults').get(),
    ]);
    const deletedMsgIds = cfgDoc.exists ? (cfgDoc.data().deletedMsgIds || []) : [];
    const customs       = customSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const defaults      = DEFAULT_MESSAGES.filter(m => !deletedMsgIds.includes(m.id));
    return [...defaults, ...customs];
  },

  async getDocs() {
    const [customSnap, cfgDoc] = await Promise.all([
      fbDb.collection('documents').orderBy('createdAt').get(),
      fbDb.collection('config').doc('defaults').get(),
    ]);
    const deletedDocIds = cfgDoc.exists ? (cfgDoc.data().deletedDocIds || []) : [];
    const customs       = customSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const defaults      = DEFAULT_DOCS.filter(d => !deletedDocIds.includes(d.id));
    return [...defaults, ...customs];
  },

  // ── Write — Messages ─────────────────────────────────────────────────

  async addMessage(msg) {
    await fbDb.collection('messages').add({
      ...msg,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  },

  async deleteMessage(id) {
    if (id.startsWith('msg_default_')) {
      // Mark default as hidden for everyone
      await fbDb.collection('config').doc('defaults').set(
        { deletedMsgIds: firebase.firestore.FieldValue.arrayUnion(id) },
        { merge: true }
      );
    } else {
      await fbDb.collection('messages').doc(id).delete();
    }
  },

  // ── Write — Documents ────────────────────────────────────────────────

  async addDoc(doc) {
    await fbDb.collection('documents').add({
      ...doc,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  },

  async deleteDoc(id) {
    if (id.startsWith('doc_default_')) {
      await fbDb.collection('config').doc('defaults').set(
        { deletedDocIds: firebase.firestore.FieldValue.arrayUnion(id) },
        { merge: true }
      );
    } else {
      await fbDb.collection('documents').doc(id).delete();
    }
  },

  // ── Users ────────────────────────────────────────────────────────────

  async getUsers() {
    const snap = await fbDb.collection('users').orderBy('createdAt').get();
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  },

  async createUser(email, password, displayName, role) {
    // Use secondary app so admin stays signed in
    const cred = await fbSecondaryAuth.createUserWithEmailAndPassword(email, password);
    await fbDb.collection('users').doc(cred.user.uid).set({
      email, displayName, role, active: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await fbSecondaryAuth.signOut();
    return cred.user.uid;
  },

  async updateUser(uid, fields) {
    await fbDb.collection('users').doc(uid).update(fields);
  },

  async resetPassword(uid, newPassword) {
    // Sign in as the user temporarily via secondary app to change password
    const userDoc = await fbDb.collection('users').doc(uid).get();
    if (!userDoc.exists) throw new Error('User not found');
    // We store the new password by re-creating via Admin — but without Admin SDK
    // we update a `tempPassword` field instead and handle it on next login
    await fbDb.collection('users').doc(uid).update({ tempPassword: newPassword });
  },

  async deleteUser(uid) {
    await fbDb.collection('users').doc(uid).update({ active: false });
  },
};
