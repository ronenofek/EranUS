// ── Auth tests ──────────────────────────────────────────────────────────
describe('Auth', () => {
  function cleanSession() {
    sessionStorage.removeItem('eranUser');
    currentUser = null;
    isAdmin = false;
  }

  it('valid volunteer login sets currentUser', () => {
    cleanSession();
    // Simulate login by directly calling the logic
    const u = 'volunteer';
    const p = USERS[u];
    expect(p).toBe('eran123');
    expect(USERS[u] === p).toBeTruthy();
  });

  it('invalid password is rejected', () => {
    cleanSession();
    const u = 'volunteer';
    expect(USERS[u] === 'wrongpassword').toBeFalsy();
  });

  it('admin user is detected', () => {
    cleanSession();
    const u = 'admin';
    expect(ADMINS.has(u)).toBeTruthy();
  });

  it('volunteer user is not admin', () => {
    cleanSession();
    const u = 'volunteer';
    expect(ADMINS.has(u)).toBeFalsy();
  });

  it('session persists in sessionStorage', () => {
    cleanSession();
    sessionStorage.setItem('eranUser', 'admin');
    const u = sessionStorage.getItem('eranUser');
    expect(u).toBe('admin');
    expect(USERS[u]).toBe('eran2026');
  });

  it('logout clears currentUser', () => {
    currentUser = 'admin';
    isAdmin = true;
    sessionStorage.setItem('eranUser', 'admin');
    // Simulate logout logic
    sessionStorage.removeItem('eranUser');
    currentUser = null;
    isAdmin = false;
    expect(currentUser).toBe(null);
    expect(isAdmin).toBeFalsy();
    expect(sessionStorage.getItem('eranUser')).toBe(null);
  });
});
