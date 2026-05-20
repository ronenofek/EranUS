// ── Message Admin ───────────────────────────────────────────────────────
const MessageAdmin = {
  _editingMsgId: null,

  openEditMsg(id, title) {
    MessageAdmin._editingMsgId = id;
    document.getElementById('editMsgTitle').value = title;
    document.getElementById('editMsgModal').classList.add('open');
  },

  async saveEditMsg() {
    const id    = MessageAdmin._editingMsgId;
    const title = document.getElementById('editMsgTitle').value.trim();
    if (!title) { Toast.show('יש להזין כותרת הודעה'); return; }
    try {
      await Storage.updateMessage(id, { title });
      document.getElementById('editMsgModal').classList.remove('open');
      const fresh = { fresh: true };
      await Messages.render(fresh);
      await AdminPanel.renderLists(fresh);
      Toast.show('✅ כותרת ההודעה עודכנה');
    } catch(e) {
      Toast.show('❌ שגיאה בעדכון: ' + (e.message || e));
    }
  },

  closeEditMsg() {
    document.getElementById('editMsgModal').classList.remove('open');
    MessageAdmin._editingMsgId = null;
  },

  async addMessage() {
    const title  = document.getElementById('newMsgTitle').value.trim();
    const body   = document.getElementById('newMsgBody').value.trim();
    const tag    = document.getElementById('newMsgTag').value.trim() || 'הודעה';
    const lText  = document.getElementById('newMsgLinkText').value.trim();
    const lUrl   = document.getElementById('newMsgLinkUrl').value.trim();
    const pinned = document.getElementById('newMsgPinned').checked;

    if (!title || !body) { Toast.show('יש למלא כותרת ותוכן'); return; }

    try {
      await Storage.addMessage({
        id: 'msg_custom_' + Date.now(), isDefault: false,
        title, tag, icon: pinned ? '📌' : '📢', body,
        linkText: lText, linkUrl: lUrl, pinned,
      });

      ['newMsgTitle','newMsgTag','newMsgBody','newMsgLinkText','newMsgLinkUrl']
        .forEach(id => document.getElementById(id).value = '');
      document.getElementById('newMsgTag').value = 'עדכון';
      document.getElementById('newMsgPinned').checked = false;

      Helpers.toggleForm('msgForm');
      await Messages.render();
      await AdminPanel.renderLists();
      Toast.show('✅ ההודעה נוספה בהצלחה');
    } catch(e) {
      Toast.show('❌ שגיאה בשמירת ההודעה');
    }
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function addMessage()   { MessageAdmin.addMessage(); }
function saveEditMsg()  { MessageAdmin.saveEditMsg(); }
function closeEditMsg() { MessageAdmin.closeEditMsg(); }
