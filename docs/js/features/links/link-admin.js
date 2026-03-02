// ── Link Admin ───────────────────────────────────────────────────────────
const LinkAdmin = {
  async addLink() {
    const title = document.getElementById('newLinkTitle').value.trim();
    const url   = document.getElementById('newLinkUrl').value.trim();
    const icon  = document.getElementById('newLinkIcon').value.trim() || '🔗';

    if (!title) { Toast.show('יש להזין שם לקישור'); return; }
    if (!url)   { Toast.show('יש להזין כתובת URL'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      Toast.show('הכתובת חייבת להתחיל ב-https://'); return;
    }

    try {
      await Storage.addLink({ isDefault: false, title, url, icon });

      document.getElementById('newLinkTitle').value = '';
      document.getElementById('newLinkUrl').value   = '';
      document.getElementById('newLinkIcon').value  = '';

      Helpers.toggleForm('linkForm');
      await Links.render();
      await AdminPanel.renderLists();
      Toast.show('✅ הקישור נוסף בהצלחה');
    } catch(e) {
      Toast.show('❌ שגיאה בשמירת הקישור');
    }
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function addLink() { LinkAdmin.addLink(); }
