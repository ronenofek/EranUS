// ── Storage tests ───────────────────────────────────────────────────────
describe('Storage', () => {
  // Reset localStorage before each test
  function cleanLS() {
    localStorage.removeItem('eran_delMsgs');
    localStorage.removeItem('eran_delDocs');
    localStorage.removeItem('eran_custMsgs');
    localStorage.removeItem('eran_custDocs');
  }

  it('loadState returns defaults when localStorage is empty', () => {
    cleanLS();
    const st = Storage.loadState();
    expect(st.deletedMsgIds).toEqual([]);
    expect(st.deletedDocIds).toEqual([]);
    expect(st.customMessages).toEqual([]);
    expect(st.customDocs).toEqual([]);
  });

  it('saveState persists and loadState restores', () => {
    cleanLS();
    const st = Storage.loadState();
    st.deletedMsgIds.push('msg_default_1');
    st.customMessages.push({ id: 'msg_custom_1', title: 'Test', isDefault: false });
    Storage.saveState(st);

    const st2 = Storage.loadState();
    expect(st2.deletedMsgIds).toContain('msg_default_1');
    expect(st2.customMessages[0].title).toBe('Test');
  });

  it('getMessages filters out deleted default messages', () => {
    cleanLS();
    const st = Storage.loadState();
    st.deletedMsgIds.push('msg_default_1');
    const msgs = Storage.getMessages(st);
    const ids = msgs.map(m => m.id);
    expect(ids).not.toContain('msg_default_1');
    expect(ids).toContain('msg_default_2');
  });

  it('getMessages includes custom messages', () => {
    cleanLS();
    const st = Storage.loadState();
    st.customMessages.push({ id: 'msg_custom_x', title: 'Custom', isDefault: false, body: 'Hello' });
    const msgs = Storage.getMessages(st);
    const ids = msgs.map(m => m.id);
    expect(ids).toContain('msg_custom_x');
  });

  it('getDocs filters out deleted default docs', () => {
    cleanLS();
    const st = Storage.loadState();
    st.deletedDocIds.push('doc_default_1');
    const docs = Storage.getDocs(st);
    const ids = docs.map(d => d.id);
    expect(ids).not.toContain('doc_default_1');
  });

  it('getDocs includes custom docs', () => {
    cleanLS();
    const st = Storage.loadState();
    st.customDocs.push({ id: 'doc_custom_x', title: 'My Doc', isDefault: false, b64: 'abc' });
    const docs = Storage.getDocs(st);
    const ids = docs.map(d => d.id);
    expect(ids).toContain('doc_custom_x');
  });
});
