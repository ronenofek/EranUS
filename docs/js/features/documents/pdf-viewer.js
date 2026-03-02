// ── PDF Viewer ──────────────────────────────────────────────────────────
const PdfViewer = {
  _blobUrl: null,

  // Convert base64 string to a Blob URL (works on iOS/Android)
  _b64ToBlobUrl(b64) {
    const binary = atob(b64);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  },

  async openDoc(title) {
    const isMobile = window.innerWidth <= 700;

    // iOS Safari blocks window.open() after any await (loses gesture context).
    // Open a blank window FIRST (synchronous, within the gesture), then navigate it.
    const newWin = isMobile ? window.open('', '_blank') : null;

    let allDocs;
    try {
      allDocs = await Storage.getDocs();
    } catch(e) {
      if (newWin) newWin.close();
      Toast.show('שגיאה בטעינת המסמכים');
      return;
    }

    const doc = allDocs.find(d => d.title === title);
    if (!doc) {
      if (newWin) newWin.close();
      Toast.show('המסמך לא נמצא');
      return;
    }

    // Case 1: uploaded doc stored in Firebase Storage → use direct URL
    if (doc.storageUrl) {
      if (isMobile) {
        newWin.location.href = doc.storageUrl;
      } else {
        this._revokeCurrent();
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalIframe').src = doc.storageUrl;
        document.getElementById('pdfModal').classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    // Case 2: default doc or legacy uploaded doc with base64
    let b64;
    if (doc.isDefault) {
      b64 = PDF_DATA[doc.key] || null;
    } else {
      b64 = doc.b64 || null;
    }
    if (!b64) {
      if (newWin) newWin.close();
      Toast.show('לא ניתן לטעון את המסמך');
      return;
    }

    // Build a Blob URL (avoids iOS data: URI limitation)
    const blobUrl = this._b64ToBlobUrl(b64);

    if (isMobile) {
      // Navigate the already-opened window to the blob URL
      newWin.location.href = blobUrl;
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return;
    }

    // Desktop: show in modal iframe
    this._revokeCurrent();
    this._blobUrl = blobUrl;

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalIframe').src = blobUrl;
    document.getElementById('pdfModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  _revokeCurrent() {
    if (this._blobUrl) {
      URL.revokeObjectURL(this._blobUrl);
      this._blobUrl = null;
    }
  },

  closeModal() {
    document.getElementById('pdfModal').classList.remove('open');
    document.getElementById('modalIframe').src = '';
    document.body.style.overflow = '';
    this._revokeCurrent();
  },

  closeModalOutside(e) {
    if (e.target.id === 'pdfModal') PdfViewer.closeModal();
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function openDoc(title)          { PdfViewer.openDoc(title); }
function closeModal()            { PdfViewer.closeModal(); }
function closeModalOutside(e)    { PdfViewer.closeModalOutside(e); }
