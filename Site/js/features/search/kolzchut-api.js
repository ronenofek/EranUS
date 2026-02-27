// ── כל זכות API ─────────────────────────────────────────────────────────
const KolZchutApi = {
  async search(query) {
    try {
      const url  = `https://www.kolzchut.org.il/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=4&srprop=snippet&format=json&origin=*`;
      const res  = await fetch(url, { signal: AbortSignal.timeout(7000) });
      const data = await res.json();
      return (data.query?.search || []).map(r => ({
        title: r.title,
        snip:  r.snippet.replace(/<[^>]*>/g, ''),
        url:   'https://www.kolzchut.org.il/he/' + encodeURIComponent(r.title),
      }));
    } catch(e) {
      return null; // null = unreachable (shown as "not available")
    }
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
async function searchKolZchut(query) { return KolZchutApi.search(query); }
