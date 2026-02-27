// ── PDF Text Extractor (PDF.js) ─────────────────────────────────────────
const PdfExtractor = {
  _workerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  _cache:     {},       // docTitle → extracted text
  _ready:     false,
  _inProgress: false,

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
        text += content.items.map(i => i.str).join(' ') + '\n';
      }
      return text;
    } catch(e) {
      console.warn('PDF extraction failed:', e);
      return '';
    }
  },

  async ensureCache() {
    if (this._ready || this._inProgress) return;
    this._inProgress = true;
    const st   = Storage.loadState();
    const docs = Storage.getDocs(st);
    for (const d of docs) {
      const b64 = d.isDefault ? PDF_DATA[d.key] : d.b64;
      if (b64 && !this._cache[d.title]) {
        this._cache[d.title] = await this.extractText(b64);
      }
    }
    this._ready     = true;
    this._inProgress = false;
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
const PDFJS_WORKER = PdfExtractor._workerSrc;
let pdfTextCache      = PdfExtractor._cache;
let pdfCacheReady     = false;
let pdfCacheInProgress = false;
async function extractPdfText(b64)  { return PdfExtractor.extractText(b64); }
async function ensurePdfCache()     { return PdfExtractor.ensureCache(); }
