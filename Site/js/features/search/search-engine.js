// ── Search Engine ───────────────────────────────────────────────────────
const SearchEngine = {
  highlight(text, query) {
    if (!query) return Helpers.escHtml(text);
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return Helpers.escHtml(text).replace(new RegExp(safe, 'gi'), m => `<mark>${m}</mark>`);
  },

  snippet(text, query, r = 100) {
    if (!text) return '';
    const t = text.toLowerCase();
    const q = query.toLowerCase();
    const idx = t.indexOf(q);
    if (idx === -1) return this.highlight(text.slice(0, r * 2), query);
    const s = Math.max(0, idx - r);
    const e = Math.min(text.length, idx + q.length + r);
    return (s > 0 ? '…' : '') + this.highlight(text.slice(s, e), query) + (e < text.length ? '…' : '');
  },

  searchInMessages(query) {
    const q  = query.toLowerCase();
    const st = Storage.loadState();
    return Storage.getMessages(st).filter(m => {
      const t = [m.title, m.tag || '', m.body || '', (m.bodyHtml || '').replace(/<[^>]*>/g, '')].join(' ').toLowerCase();
      return t.includes(q);
    }).map(m => ({ title: m.title, snip: this.snippet(m.body || m.bodyHtml || '', query) }));
  },

  searchInDocs(query) {
    const q = query.toLowerCase();
    return Object.entries(PdfExtractor._cache)
      .filter(([, text]) => text.toLowerCase().includes(q))
      .map(([title, text]) => ({ title, snip: this.snippet(text, query) }));
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function highlight(text, query)      { return SearchEngine.highlight(text, query); }
function snippet(text, query, r=100) { return SearchEngine.snippet(text, query, r); }
function searchInMessages(query)     { return SearchEngine.searchInMessages(query); }
function searchInDocs(query)         { return SearchEngine.searchInDocs(query); }
