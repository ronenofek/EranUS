// ── Integration tests ───────────────────────────────────────────────────
// These tests verify the key workflows work end-to-end at the JS layer
// (no DOM rendering — we test the data layer and module interactions).

describe('Integration: Add and delete a message', () => {
  function cleanLS() {
    localStorage.removeItem('eran_delMsgs');
    localStorage.removeItem('eran_delDocs');
    localStorage.removeItem('eran_custMsgs');
    localStorage.removeItem('eran_custDocs');
  }

  it('adding a custom message persists it', () => {
    cleanLS();
    const st = Storage.loadState();
    st.customMessages.push({
      id: 'msg_custom_integration_1', isDefault: false,
      title: 'Test Message', tag: 'בדיקה', icon: '📢',
      body: 'Test body text', linkText: '', linkUrl: '',
    });
    Storage.saveState(st);

    const st2 = Storage.loadState();
    const msgs = Storage.getMessages(st2);
    const found = msgs.find(m => m.id === 'msg_custom_integration_1');
    expect(found).toBeTruthy();
    expect(found.title).toBe('Test Message');
    cleanLS();
  });

  it('deleting a custom message removes it', () => {
    cleanLS();
    const st = Storage.loadState();
    st.customMessages.push({
      id: 'msg_custom_integration_2', isDefault: false,
      title: 'To Delete', body: 'Delete me', linkText: '', linkUrl: '',
    });
    Storage.saveState(st);

    // Delete it
    const st2 = Storage.loadState();
    st2.customMessages = st2.customMessages.filter(m => m.id !== 'msg_custom_integration_2');
    Storage.saveState(st2);

    const st3 = Storage.loadState();
    const msgs = Storage.getMessages(st3);
    const found = msgs.find(m => m.id === 'msg_custom_integration_2');
    expect(found).toBeFalsy();
    cleanLS();
  });

  it('soft-deleting a default message hides it', () => {
    cleanLS();
    const st = Storage.loadState();
    st.deletedMsgIds.push('msg_default_1');
    Storage.saveState(st);

    const st2 = Storage.loadState();
    const msgs = Storage.getMessages(st2);
    const found = msgs.find(m => m.id === 'msg_default_1');
    expect(found).toBeFalsy();
    cleanLS();
  });
});

describe('Integration: Auth flow', () => {
  it('USERS contains volunteer and admin', () => {
    expect(typeof USERS['volunteer']).toBe('string');
    expect(typeof USERS['admin']).toBe('string');
  });

  it('ADMINS set contains admin but not volunteer', () => {
    expect(ADMINS.has('admin')).toBeTruthy();
    expect(ADMINS.has('volunteer')).toBeFalsy();
  });

  it('DEFAULT_DOCS have expected keys matching PDF_DATA', () => {
    DEFAULT_DOCS.forEach(d => {
      if (d.isDefault) {
        expect(typeof PDF_DATA[d.key]).toBe('string');
        expect(PDF_DATA[d.key].length).toBeGreaterThan(0);
      }
    });
  });
});
