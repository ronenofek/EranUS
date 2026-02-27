// ── PDF Text Extractor (PDF.js) ─────────────────────────────────────────
const PdfExtractor = {
  _workerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  _cache:        {},     // docTitle → extracted text
  _ready:        false,
  _buildPromise: null,   // shared promise so concurrent callers all wait correctly

  async extractText(b64) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) return '';
    pdfjsLib.GlobalWorkerOptions.workerSrc = this._workerSrc;
    try {
      const raw   = atob(b64);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      const pdf  = await pdfjsLib.getDocument({ data: bytes }).promise;
      let text = '';
      for (let p = 1; p <= pdf.numPages; p++) {
        const page    = await pdf.getPage(p);
        const content = await page.getTextContent();
        // Join with NO separator so phone numbers like "052-123" stay intact
        // even when the PDF stores digits/hyphen as separate text runs.
        // Add a space after each page for word boundaries.
        text += content.items.map(i => i.str).join('') + ' ';
      }
      return text;
    } catch(e) {
      console.warn('PDF extraction failed:', e);
      return '';
    }
  },

  // Returns a promise that resolves once the cache is fully built.
  // Multiple concurrent callers all await the same promise.
  ensureCache() {
    if (this._ready) return Promise.resolve();
    if (this._buildPromise) return this._buildPromise;   // already building — share it
    this._buildPromise = (async () => {
      const st   = Storage.loadState();
      const docs = Storage.getDocs(st);
      for (const d of docs) {
        const b64 = d.isDefault ? PDF_DATA[d.key] : d.b64;
        if (b64 && !this._cache[d.title]) {
          this._cache[d.title] = await this.extractText(b64);
        }
      }
      this._ready = true;
    })();
    return this._buildPromise;
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
const PDFJS_WORKER = PdfExtractor._workerSrc;
let pdfTextCache       = PdfExtractor._cache;
let pdfCacheReady      = false;
let pdfCacheInProgress = false;
async function extractPdfText(b64) { return PdfExtractor.extractText(b64); }
async function ensurePdfCache()    { return PdfExtractor.ensureCache(); }
