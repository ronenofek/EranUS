// ── Search Engine tests ─────────────────────────────────────────────────
describe('SearchEngine', () => {
  function cleanLS() {
    localStorage.removeItem('eran_delMsgs');
    localStorage.removeItem('eran_delDocs');
    localStorage.removeItem('eran_custMsgs');
    localStorage.removeItem('eran_custDocs');
  }

  it('searchInMessages finds by title keyword', () => {
    cleanLS();
    const results = SearchEngine.searchInMessages('מגיבים');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('מגיבים');
  });

  it('searchInMessages returns empty for nonsense query', () => {
    cleanLS();
    const results = SearchEngine.searchInMessages('zzzzxxxxxqqqq999');
    expect(results.length).toBe(0);
  });

  it('searchInMessages finds custom messages', () => {
    cleanLS();
    const st = Storage.loadState();
    st.customMessages.push({
      id: 'msg_custom_test', isDefault: false,
      title: 'פגישת צוות', body: 'הפגישה תתקיים ביום שני',
    });
    Storage.saveState(st);
    const results = SearchEngine.searchInMessages('פגישה');
    const titles = results.map(r => r.title);
    expect(titles).toContain('פגישת צוות');
    cleanLS();
  });

  it('snippet returns text containing query with ellipsis for long text', () => {
    const long = 'א'.repeat(50) + 'מילת חיפוש' + 'ב'.repeat(50);
    const snip = SearchEngine.snippet(long, 'מילת חיפוש');
    expect(snip).toContain('מילת');
  });

  it('snippet returns empty string for empty text', () => {
    const snip = SearchEngine.snippet('', 'test');
    expect(snip).toBe('');
  });

  it('searchInDocs returns empty when cache is empty', () => {
    // Cache is empty on fresh load
    PdfExtractor._cache = {};
    const results = SearchEngine.searchInDocs('anything');
    expect(results.length).toBe(0);
  });

  it('searchInDocs finds from cache', () => {
    PdfExtractor._cache = { 'מסמך בדיקה': 'זהו תוכן עם מילת חיפוש ספציפית' };
    const results = SearchEngine.searchInDocs('מילת חיפוש');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('מסמך בדיקה');
    PdfExtractor._cache = {};
  });
});
