// ── Admin Panel ─────────────────────────────────────────────────────────
const AdminPanel = {
  _confirmCallback: null,

  renderLists() {
    if (!isAdmin) return;
    const st = Storage.loadState();

    // Messages list
    const allMsgs = Storage.getMessages(st);
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
    const allDocs = Storage.getDocs(st);
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
  },

  confirmDelete(type, id, name) {
    document.getElementById('confirmTitle').textContent = type === 'msg' ? 'מחיקת הודעה' : 'מחיקת מסמך';
    document.getElementById('confirmText').textContent  = `האם אתה בטוח שברצונך למחוק את "${name}"? פעולה זו לא ניתנת לביטול.`;
    this._confirmCallback = () => this.doDelete(type, id);
    document.getElementById('confirmOkBtn').onclick = () => {
      this._confirmCallback && this._confirmCallback();
      this.closeConfirm();
    };
    document.getElementById('confirmModal').classList.add('open');
  },

  closeConfirm() {
    document.getElementById('confirmModal').classList.remove('open');
  },

  doDelete(type, id) {
    const st = Storage.loadState();
    if (type === 'msg') {
      if (id.startsWith('msg_default_')) {
        if (!st.deletedMsgIds.includes(id)) st.deletedMsgIds.push(id);
      } else {
        st.customMessages = st.customMessages.filter(m => m.id !== id);
      }
      Storage.saveState(st);
      Messages.render();
      AdminPanel.renderLists();
      Toast.show('🗑 ההודעה נמחקה');
    } else {
      if (id.startsWith('doc_default_')) {
        if (!st.deletedDocIds.includes(id)) st.deletedDocIds.push(id);
      } else {
        st.customDocs = st.customDocs.filter(d => d.id !== id);
      }
      Storage.saveState(st);
      Docs.render();
      AdminPanel.renderLists();
      Toast.show('🗑 המסמך נמחק');
    }
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function renderAdminLists()           { AdminPanel.renderLists(); }
function confirmDelete(type, id, name) { AdminPanel.confirmDelete(type, id, name); }
function closeConfirm()               { AdminPanel.closeConfirm(); }
function doDelete(type, id)           { AdminPanel.doDelete(type, id); }
