// ── User Admin ──────────────────────────────────────────────────────────
// Manages users: add (manual or CSV), edit role, reset password, deactivate.

const UserAdmin = {
  _editingUid: null,

  // ── Render user table ─────────────────────────────────────────────────
  async renderUsers() {
    if (!isAdmin) return;
    const users = await Storage.getUsers();
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;

    tbody.innerHTML = users.map(u => `
      <tr class="${!u.active ? 'user-inactive' : ''}">
        <td>${Helpers.escHtml(u.displayName || '')}</td>
        <td>${Helpers.escHtml(u.email)}</td>
        <td><span class="role-badge role-${u.role}">${u.role === 'admin' ? 'מנהל' : 'מתנדב'}</span></td>
        <td><span class="status-badge ${u.active ? 'active' : 'inactive'}">${u.active ? 'פעיל' : 'מושהה'}</span></td>
        <td class="user-actions">
          <button class="btn btn-sm btn-secondary" onclick="UserAdmin.openEditUser('${u.uid}','${Helpers.escHtml(u.displayName)}','${u.role}','${Helpers.escHtml(u.email)}')">✏️ עריכה</button>
          <button class="btn btn-sm btn-secondary" onclick="UserAdmin.openResetPassword('${u.uid}','${Helpers.escHtml(u.displayName)}')">🔑 איפוס</button>
          ${u.uid !== _currentUid() ? `
          <button class="btn btn-sm btn-danger" onclick="UserAdmin.toggleActive('${u.uid}','${Helpers.escHtml(u.displayName)}',${u.active})">${u.active ? '🚫 השהה' : '✅ הפעל'}</button>
          <button class="btn btn-sm btn-danger" onclick="UserAdmin.deleteUser('${u.uid}','${Helpers.escHtml(u.displayName)}')">🗑 מחק</button>
          ` : ''}
        </td>
      </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">אין משתמשים</td></tr>';
  },

  // ── Add user manually ─────────────────────────────────────────────────
  async addUserManual() {
    const name  = document.getElementById('newUserName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const role  = document.getElementById('newUserRole').value;
    const pass  = document.getElementById('newUserPass').value;

    if (!name || !email || !pass) { Toast.show('יש למלא את כל השדות'); return; }
    if (pass.length < 6)          { Toast.show('הסיסמה חייבת להכיל לפחות 6 תווים'); return; }

    try {
      await Storage.createUser(email, pass, name, role);
      ['newUserName','newUserEmail','newUserPass'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('newUserRole').value = 'volunteer';
      Helpers.toggleForm('userForm');
      await UserAdmin.renderUsers();
      Toast.show(`✅ המשתמש ${name} נוסף בהצלחה`);
    } catch(e) {
      if (e.code === 'auth/email-already-in-use') Toast.show('❌ המייל הזה כבר רשום במערכת');
      else if (e.code === 'auth/invalid-email')   Toast.show('❌ כתובת מייל לא תקינה');
      else Toast.show('❌ שגיאה ביצירת המשתמש: ' + (e.message || ''));
    }
  },

  // ── Import from CSV / Excel ───────────────────────────────────────────
  async importFromFile(input) {
    const file = input.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Detect header row
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('email') || firstLine.includes('name') || firstLine.includes('שם');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    if (!dataLines.length) { Toast.show('הקובץ ריק או לא תקין'); return; }

    let ok = 0, fail = 0, errors = [];

    for (const line of dataLines) {
      // Support both comma and semicolon separators
      const cols = line.split(/[,;]/).map(c => c.trim().replace(/^"|"$/g, ''));
      // Expected: email, name, role, password
      const [email, name, role, pass] = cols;
      if (!email || !pass) { fail++; errors.push(email || '(שורה ריקה)'); continue; }

      const validRole = (role || '').toLowerCase() === 'admin' ? 'admin' : 'volunteer';
      const displayName = name || email.split('@')[0];

      try {
        await Storage.createUser(email, pass, displayName, validRole);
        ok++;
      } catch(e) {
        fail++;
        errors.push(`${email}: ${e.message}`);
      }
    }

    input.value = '';
    await UserAdmin.renderUsers();

    let msg = `✅ יובאו ${ok} משתמשים בהצלחה`;
    if (fail) msg += ` | ❌ ${fail} נכשלו`;
    Toast.show(msg);
    if (errors.length) console.warn('ייבוא שגיאות:', errors);
  },

  // ── Edit user (name + role) ───────────────────────────────────────────
  openEditUser(uid, name, role, email) {
    UserAdmin._editingUid = uid;
    document.getElementById('editUserName').value  = name;
    document.getElementById('editUserEmail').value = email || '';
    document.getElementById('editUserRole').value  = role;
    document.getElementById('editUserModal').classList.add('open');
  },

  async saveEditUser() {
    const uid   = UserAdmin._editingUid;
    const name  = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const role  = document.getElementById('editUserRole').value;
    if (!name)  { Toast.show('יש להזין שם'); return; }
    if (!email) { Toast.show('יש להזין מייל'); return; }

    try {
      await Storage.updateUser(uid, { displayName: name, email, role });
      document.getElementById('editUserModal').classList.remove('open');
      await UserAdmin.renderUsers();
      Toast.show('✅ המשתמש עודכן');
    } catch(e) {
      Toast.show('❌ שגיאה בעדכון');
    }
  },

  async deleteUser(uid, name) {
    if (!confirm(`האם למחוק לצמיתות את המשתמש "${name}"?\nפעולה זו אינה ניתנת לביטול.`)) return;
    try {
      await Storage.hardDeleteUser(uid);
      await UserAdmin.renderUsers();
      Toast.show(`🗑 המשתמש ${name} נמחק`);
    } catch(e) {
      Toast.show('❌ שגיאה במחיקת המשתמש');
    }
  },

  closeEditUser() {
    document.getElementById('editUserModal').classList.remove('open');
    UserAdmin._editingUid = null;
  },

  // ── Reset password ────────────────────────────────────────────────────
  openResetPassword(uid, name) {
    UserAdmin._editingUid = uid;
    document.getElementById('resetPassLabel').textContent = `סיסמה חדשה עבור ${name}:`;
    document.getElementById('newPassValue').value = '';
    document.getElementById('resetPassModal').classList.add('open');
  },

  async saveResetPassword() {
    const uid  = UserAdmin._editingUid;
    const pass = document.getElementById('newPassValue').value;
    if (pass.length < 6) { Toast.show('הסיסמה חייבת להיות לפחות 6 תווים'); return; }

    try {
      await Storage.resetPassword(uid, pass);
      document.getElementById('resetPassModal').classList.remove('open');
      Toast.show('✅ הסיסמה אופסה. המשתמש יתבקש להשתמש בסיסמה החדשה בכניסה הבאה.');
    } catch(e) {
      Toast.show('❌ שגיאה באיפוס הסיסמה');
    }
  },

  closeResetPassword() {
    document.getElementById('resetPassModal').classList.remove('open');
    UserAdmin._editingUid = null;
  },

  // ── Toggle active/suspended ───────────────────────────────────────────
  async toggleActive(uid, name, currentlyActive) {
    const action = currentlyActive ? 'להשהות' : 'להפעיל מחדש';
    if (!confirm(`האם ל${action} את המשתמש ${name}?`)) return;

    try {
      await Storage.updateUser(uid, { active: !currentlyActive });
      await UserAdmin.renderUsers();
      Toast.show(currentlyActive ? `🚫 ${name} הושהה` : `✅ ${name} הופעל מחדש`);
    } catch(e) {
      Toast.show('❌ שגיאה בעדכון הסטטוס');
    }
  },
};

// ── Helper: current user's uid ──────────────────────────────────────────
function _currentUid() {
  return fbAuth.currentUser ? fbAuth.currentUser.uid : '';
}

// ── Backwards-compatible global shims ──────────────────────────────────
function renderUsers()         { UserAdmin.renderUsers(); }
function addUserManual()       { UserAdmin.addUserManual(); }
function saveEditUser()        { UserAdmin.saveEditUser(); }
function closeEditUser()       { UserAdmin.closeEditUser(); }
function saveResetPassword()   { UserAdmin.saveResetPassword(); }
function closeResetPassword()  { UserAdmin.closeResetPassword(); }
