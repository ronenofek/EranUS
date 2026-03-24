// ── App Bootstrap ───────────────────────────────────────────────────────
const App = {
  async initApp() {
    document.getElementById('topbarUser').textContent = 'שלום, ' + currentUser;
    document.getElementById('adminBadge').style.display = isAdmin ? 'inline-block' : 'none';

    // Show admin toggle button for admins
    const btnAdmin = document.getElementById('btn-admin-toggle');
    if (btnAdmin) btnAdmin.style.display = isAdmin ? '' : 'none';

    if (isAdmin) document.body.classList.add('admin-mode');
    else         document.body.classList.remove('admin-mode');

    await Messages.render();
    await Docs.render();
    await Links.render();
    await AdminPanel.renderLists();
    if (isAdmin) await UserAdmin.renderUsers();
  },

  // ── Admin overlay ──────────────────────────────────────────────────
  toggleAdmin() {
    const overlay = document.getElementById('adminOverlay');
    if (overlay.classList.contains('open')) {
      App.closeAdmin();
    } else {
      overlay.classList.add('open');
      overlay.scrollTop = 0;
    }
  },

  closeAdmin() {
    document.getElementById('adminOverlay').classList.remove('open');
  },

  // ── Calendar modal ─────────────────────────────────────────────────
  openCalendar() {
    document.getElementById('calendarModal').classList.add('open');
  },

  closeCalendar() {
    document.getElementById('calendarModal').classList.remove('open');
  },

  closeCalendarOutside(e) {
    if (e.target === document.getElementById('calendarModal')) App.closeCalendar();
  },

  // ── Backwards-compat shim (no longer tabs — scroll page) ──────────
  showView(v) {
    // No-op for non-admin views — page is single scroll now.
    // Admin is handled via overlay.
    if (v === 'admin') App.toggleAdmin();
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function initApp()   { App.initApp(); }
function showView(v) { App.showView(v); }
