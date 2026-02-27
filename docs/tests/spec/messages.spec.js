// ── Messages tests ──────────────────────────────────────────────────────
describe('Messages', () => {
  function cleanLS() {
    localStorage.removeItem('eran_delMsgs');
    localStorage.removeItem('eran_delDocs');
    localStorage.removeItem('eran_custMsgs');
    localStorage.removeItem('eran_custDocs');
  }

  it('DEFAULT_MESSAGES has at least 2 messages', () => {
    expect(DEFAULT_MESSAGES.length).toBeGreaterThan(1);
  });

  it('all default messages have required fields', () => {
    DEFAULT_MESSAGES.forEach(m => {
      expect(typeof m.id).toBe('string');
      expect(typeof m.title).toBe('string');
      expect(m.isDefault).toBe(true);
    });
  });

  it('renderCustomBody escapes HTML in body', () => {
    const m = { body: '<script>alert(1)</script>', linkText: '', linkUrl: '' };
    const html = Messages.renderCustomBody(m);
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('renderCustomBody includes link button when linkText and linkUrl are set', () => {
    const m = { body: 'hello', linkText: 'Click me', linkUrl: 'https://example.com' };
    const html = Messages.renderCustomBody(m);
    expect(html).toContain('Click me');
    expect(html).toContain('https://example.com');
  });

  it('renderCustomBody omits link when linkText is empty', () => {
    const m = { body: 'hello', linkText: '', linkUrl: 'https://example.com' };
    const html = Messages.renderCustomBody(m);
    expect(html).not.toContain('https://example.com');
  });

  it('getMessages returns default + custom, excludes deleted', () => {
    cleanLS();
    const st = Storage.loadState();
    st.deletedMsgIds.push('msg_default_1');
    st.customMessages.push({ id: 'msg_custom_1', title: 'New', isDefault: false, body: 'Body' });
    const msgs = Storage.getMessages(st);
    const ids = msgs.map(m => m.id);
    expect(ids).not.toContain('msg_default_1');
    expect(ids).toContain('msg_default_2');
    expect(ids).toContain('msg_custom_1');
    cleanLS();
  });
});
