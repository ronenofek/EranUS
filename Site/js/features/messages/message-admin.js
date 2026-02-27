// ── Message Admin ───────────────────────────────────────────────────────
const MessageAdmin = {
  addMessage() {
    const title = document.getElementById('newMsgTitle').value.trim();
    const body  = document.getElementById('newMsgBody').value.trim();
    const tag   = document.getElementById('newMsgTag').value.trim() || 'הודעה';
    const lText = document.getElementById('newMsgLinkText').value.trim();
    const lUrl  = document.getElementById('newMsgLinkUrl').value.trim();

    if (!title || !body) { Toast.show('יש למלא כותרת ותוכן'); return; }

    const st = Storage.loadState();
    st.customMessages.push({
      id: 'msg_custom_' + Date.now(), isDefault: false,
      title, tag, icon: '📢', body, linkText: lText, linkUrl: lUrl
    });
    Storage.saveState(st);

    ['newMsgTitle','newMsgTag','newMsgBody','newMsgLinkText','newMsgLinkUrl']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('newMsgTag').value = 'עדכון';

    Helpers.toggleForm('msgForm');
    Messages.render();
    AdminPanel.renderLists();
    Toast.show('✅ ההודעה נוספה בהצלחה');
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function addMessage() { MessageAdmin.addMessage(); }
