// ── App Bootstrap ───────────────────────────────────────────────────────
const App = {
  async initApp() {
    document.getElementById('topbarUser').textContent = 'שלום, ' + currentUser;
    document.getElementById('adminBadge').style.display = isAdmin ? 'inline-block' : 'none';
    ['adminSep', 'adminSection', 'nav-admin'].forEach(id => {
      document.getElementById(id).style.display = isAdmin ? '' : 'none';
    });
    // Show admin tab in mobile bottom nav
    const bnAdmin = document.getElementById('bn-admin');
    if (bnAdmin) bnAdmin.style.display = isAdmin ? '' : 'none';

    if (isAdmin) document.body.classList.add('admin-mode');
    else         document.body.classList.remove('admin-mode');

    await Messages.render();
    await Docs.render();
    await AdminPanel.renderLists();
    if (isAdmin) await UserAdmin.renderUsers();
  },

  showView(v) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('view-' + v).classList.add('active');
    document.getElementById('nav-' + v).classList.add('active');

    // Sync mobile bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));
    const bn = document.getElementById('bn-' + v);
    if (bn) bn.classList.add('active');

    const mc = document.querySelector('.main-content');
    if (v === 'calendar') mc.classList.add('calendar-active');
    else mc.classList.remove('calendar-active');

    if (v === 'messages') {
      document.getElementById('msgBadge').style.display = 'none';
      const mb = document.getElementById('msgBadgeMobile');
      if (mb) mb.style.display = 'none';
    }

    // Refresh user list when switching to admin view
    if (v === 'admin' && isAdmin) UserAdmin.renderUsers();
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function initApp()   { App.initApp(); }
function showView(v) { App.showView(v); }
