// ── App Bootstrap ───────────────────────────────────────────────────────
const App = {
  initApp() {
    document.getElementById('topbarUser').textContent = 'שלום, ' + currentUser;
    document.getElementById('adminBadge').style.display = isAdmin ? 'inline-block' : 'none';
    ['adminSep', 'adminSection', 'nav-admin'].forEach(id => {
      document.getElementById(id).style.display = isAdmin ? '' : 'none';
    });
    if (isAdmin) document.body.classList.add('admin-mode');
    else document.body.classList.remove('admin-mode');

    Messages.render();
    Docs.render();
    AdminPanel.renderLists();
  },

  showView(v) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('view-' + v).classList.add('active');
    document.getElementById('nav-' + v).classList.add('active');

    // Calendar needs overflow hidden to fill height
    const mc = document.querySelector('.main-content');
    if (v === 'calendar') mc.classList.add('calendar-active');
    else mc.classList.remove('calendar-active');

    if (v === 'messages') document.getElementById('msgBadge').style.display = 'none';
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function initApp()      { App.initApp(); }
function showView(v)    { App.showView(v); }
