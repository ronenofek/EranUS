// ── Message Admin ───────────────────────────────────────────────────────
const MessageAdmin = {
  async addMessage() {
    const title = document.getElementById('newMsgTitle').value.trim();
    const body  = document.getElementById('newMsgBody').value.trim();
    const tag   = document.getElementById('newMsgTag').value.trim() || 'הודעה';
    const lText = document.getElementById('newMsgLinkText').value.trim();
    const lUrl  = document.getElementById('newMsgLinkUrl').value.trim();

    if (!title || !body) { Toast.show('יש למלא כותרת ותוכן'); return; }

    try {
      await Storage.addMessage({
        id: 'msg_custom_' + Date.now(), isDefault: false,
        title, tag, icon: '📢', body, linkText: lText, linkUrl: lUrl,
      });

      ['newMsgTitle','newMsgTag','newMsgBody','newMsgLinkText','newMsgLinkUrl']
        .forEach(id => document.getElementById(id).value = '');
      document.getElementById('newMsgTag').value = 'עדכון';

      Helpers.toggleForm('msgForm');
      await Messages.render();
      await AdminPanel.renderLists();
      Toast.show('✅ ההודעה נוספה בהצלחה');
    } catch(e) {
      Toast.show('❌ שגיאה בשמירת ההודעה');
    }
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function addMessage() { MessageAdmin.addMessage(); }
