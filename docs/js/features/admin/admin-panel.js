// ── Admin Panel ─────────────────────────────────────────────────────────
const AdminPanel = {
  _confirmCallback: null,

  async renderLists(opts) {
    if (!isAdmin) return;

    const [allMsgs, allDocs, allLinks] = await Promise.all([
      Storage.getMessages(opts),
      Storage.getDocs(opts),
      Storage.getLinks(opts),
    ]);

    // Messages list
    document.getElementById('adminMsgList').innerHTML = allMsgs.length
      ? allMsgs.map(m => `
          <div class="admin-list-item">
            <div class="ali-icon">${m.icon || '📢'}</div>
            <div class="ali-info">
              <div class="ali-title">${Helpers.escHtml(m.title)}</div>
              <div class="ali-meta">${m.isDefault ? 'הודעת ברירת מחדל' : 'הודעה מותאמת אישית'}</div>
            </div>
            <div class="ali-actions">
              <button class="btn btn-danger btn-sm" onclick="AdminPanel.confirmDelete('msg','${m.id}','${Helpers.escHtml(m.title)}')">🗑 מחק</button>
            </div>
          </div>`).join('')
      : '<p style="color:var(--text-muted);font-size:14px">אין הודעות להצגה.</p>';

    // Docs list
    document.getElementById('adminDocList').innerHTML = allDocs.length
      ? allDocs.map(d => `
          <div class="admin-list-item">
            <div class="ali-icon">📄</div>
            <div class="ali-info">
              <div class="ali-title">${Helpers.escHtml(d.title)}</div>
              <div class="ali-meta">${d.isDefault ? 'מסמך ברירת מחדל' : 'מסמך מותאם אישית'}</div>
            </div>
            <div class="ali-actions">
              <button class="btn btn-danger btn-sm" onclick="AdminPanel.confirmDelete('doc','${d.id}','${Helpers.escHtml(d.title)}')">🗑 מחק</button>
            </div>
          </div>`).join('')
      : '<p style="color:var(--text-muted);font-size:14px">אין מסמכים להצגה.</p>';

    // Links list
    document.getElementById('adminLinkList').innerHTML = allLinks.length
      ? allLinks.map(l => `
          <div class="admin-list-item">
            <div class="ali-icon">${l.icon || '🔗'}</div>
            <div class="ali-info">
              <div class="ali-title">${Helpers.escHtml(l.title)}</div>
              <div class="ali-meta">${Helpers.escHtml(l.url)}</div>
            </div>
            <div class="ali-actions">
              <button class="btn btn-danger btn-sm" onclick="AdminPanel.confirmDelete('link','${l.id}','${Helpers.escHtml(l.title)}')">🗑 מחק</button>
            </div>
          </div>`).join('')
      : '<p style="color:var(--text-muted);font-size:14px">אין קישורים להצגה.</p>';
  },

  confirmDelete(type, id, name) {
    const titles = { msg: 'מחיקת הודעה', doc: 'מחיקת מסמך', link: 'מחיקת קישור' };
    document.getElementById('confirmTitle').textContent = titles[type] || 'מחיקה';
    document.getElementById('confirmText').textContent  =
      `האם אתה בטוח שברצונך למחוק את "${name}"? פעולה זו לא ניתנת לביטול.`;
    document.getElementById('confirmOkBtn').onclick = async () => {
      await AdminPanel.doDelete(type, id);
      AdminPanel.closeConfirm();
    };
    document.getElementById('confirmModal').classList.add('open');
  },

  closeConfirm() {
    document.getElementById('confirmModal').classList.remove('open');
  },

  async doDelete(type, id) {
    const fresh = { fresh: true };
    try {
      if (type === 'msg') {
        await Storage.deleteMessage(id);
        await Messages.render(fresh);
        Toast.show('🗑 ההודעה נמחקה');
      } else if (type === 'doc') {
        await Storage.deleteDoc(id);
        await Docs.render(fresh);
        Toast.show('🗑 המסמך נמחק');
      } else if (type === 'link') {
        await Storage.deleteLink(id);
        await Links.render(fresh);
        Toast.show('🗑 הקישור נמחק');
      }
      await AdminPanel.renderLists(fresh);
    } catch(e) {
      console.error('doDelete error:', e);
      Toast.show('❌ שגיאה: ' + (e.message || e));
    }
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function renderAdminLists()            { AdminPanel.renderLists(); }
function confirmDelete(type, id, name) { AdminPanel.confirmDelete(type, id, name); }
function closeConfirm()                { AdminPanel.closeConfirm(); }
function doDelete(type, id)            { AdminPanel.doDelete(type, id); }
