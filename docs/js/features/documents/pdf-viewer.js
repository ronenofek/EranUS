// ── PDF Viewer ──────────────────────────────────────────────────────────
const PdfViewer = {
  openDoc(title) {
    const st      = Storage.loadState();
    const allDocs = Storage.getDocs(st);
    const doc     = allDocs.find(d => d.title === title);
    if (!doc) { Toast.show('המסמך לא נמצא'); return; }

    let src;
    if (doc.isDefault) {
      const b64 = PDF_DATA[doc.key];
      src = b64 ? 'data:application/pdf;base64,' + b64 : '';
    } else {
      src = doc.b64 ? 'data:application/pdf;base64,' + doc.b64 : '';
    }
    if (!src) { Toast.show('לא ניתן לטעון את המסמך'); return; }

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalIframe').src = src;
    document.getElementById('pdfModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    document.getElementById('pdfModal').classList.remove('open');
    document.getElementById('modalIframe').src = '';
    document.body.style.overflow = '';
  },

  closeModalOutside(e) {
    if (e.target.id === 'pdfModal') PdfViewer.closeModal();
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function openDoc(title)          { PdfViewer.openDoc(title); }
function closeModal()            { PdfViewer.closeModal(); }
function closeModalOutside(e)    { PdfViewer.closeModalOutside(e); }
