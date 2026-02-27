// ── localStorage abstraction ────────────────────────────────────────────
// Keys must never change — existing user data depends on them.
const Storage = {
  KEYS: {
    DEL_MSGS:   'eran_delMsgs',
    DEL_DOCS:   'eran_delDocs',
    CUST_MSGS:  'eran_custMsgs',
    CUST_DOCS:  'eran_custDocs',
  },

  loadState() {
    return {
      deletedMsgIds:  JSON.parse(localStorage.getItem(this.KEYS.DEL_MSGS)  || '[]'),
      deletedDocIds:  JSON.parse(localStorage.getItem(this.KEYS.DEL_DOCS)  || '[]'),
      customMessages: JSON.parse(localStorage.getItem(this.KEYS.CUST_MSGS) || '[]'),
      customDocs:     JSON.parse(localStorage.getItem(this.KEYS.CUST_DOCS) || '[]'),
    };
  },

  saveState(st) {
    localStorage.setItem(this.KEYS.DEL_MSGS,  JSON.stringify(st.deletedMsgIds));
    localStorage.setItem(this.KEYS.DEL_DOCS,  JSON.stringify(st.deletedDocIds));
    localStorage.setItem(this.KEYS.CUST_MSGS, JSON.stringify(st.customMessages));
    localStorage.setItem(this.KEYS.CUST_DOCS, JSON.stringify(st.customDocs));
  },

  getMessages(st) {
    const active = DEFAULT_MESSAGES.filter(m => !st.deletedMsgIds.includes(m.id));
    return [...active, ...st.customMessages];
  },

  getDocs(st) {
    const active = DEFAULT_DOCS.filter(d => !st.deletedDocIds.includes(d.id));
    return [...active, ...st.customDocs];
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function loadState()     { return Storage.loadState(); }
function saveState(st)   { return Storage.saveState(st); }
function getMessages(st) { return Storage.getMessages(st); }
function getDocs(st)     { return Storage.getDocs(st); }
