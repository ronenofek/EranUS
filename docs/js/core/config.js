// ── Auth handled by Firebase (firebase-init.js + auth.js) ───────────────

// ── Default Messages ────────────────────────────────────────────────────
const DEFAULT_MESSAGES = [
  {
    id: 'msg_default_1', isDefault: true,
    title: 'קו ייעודי עבור מגיבים ראשונים',
    tag: 'עדכון שירות', icon: '🚒', headerClass: '',
    bodyHtml: `<p class="msg-text">מתנדבים יקרים,

כוחות הביטחון נמצאים בקו הראשון של האירועים הביטחוניים. הם פועלים בזירות מורכבות הכוללות פציעות פיזיות ופגיעות בנפש, נחשפים למחזות קשים ופעמים רבות נמצאים בסכנת חיים ישירה. לצד העומס המבצעי והרגשי, הם נדרשים להמשיך לתפקד באופן מיטבי.

כדי לספק מענה ישיר, נגיש ובטוח, אנו פועלים יחד עם <strong>היחידה למניעת אובדנות במשרד הבריאות</strong>, להקמת קו סיוע ייעודי ושירות ברשת עבור מגיבים ראשונים ובני משפחותיהם.

השירות מיועד ל: <strong>משטרת ישראל, שב"ס, כיבוי והצלה, איחוד הצלה וזק"א</strong>.

השיחות הן שיחות ער"ן לכל דבר, המיועדות למתן עזרה נפשית ראשונה ותמיכה.
הדרכות נוספות יערכו בסניפים.</p>
<div class="info-box"><div class="info-box-icon">📅</div><div class="info-box-text"><span>מועד פתיחת השירות:</span> 8 במרץ 2026</div></div>
<div class="divider"></div>
<div class="msg-actions">
  <a class="btn btn-primary" href="https://us02web.zoom.us/rec/share/oiw_bSAu-7MHL7X77fCgveUT0pQKySQQ_2NTBi4iA7Z_YqJuCsSciznO31PzzR64.Wu-96uujxVOz4vFy" target="_blank" rel="noopener">🎥 לינק לחומרי הכנה</a>
  <button class="btn btn-accent" onclick="Helpers.copyZoomPass()">🔑 העתק סיסמת זום</button>
</div>
<div class="info-box" style="margin-top:10px">
  <div class="info-box-icon">🔒</div>
  <div class="info-box-text"><span>סיסמת זום:</span> mkP%093* &nbsp;—&nbsp; <button onclick="Helpers.copyZoomPass()" style="background:none;border:none;cursor:pointer;color:#8B5E0A;font-weight:600;font-family:inherit;font-size:13px;padding:0">לחץ להעתקה</button></div>
</div>`
  },
  {
    id: 'msg_default_2', isDefault: true,
    title: 'קו סיוע ייעודי לעמותת דובדבן',
    tag: 'עדכון שירות', icon: '🍒', headerClass: 'blue',
    bodyHtml: `<p class="msg-text">השיחה היא שיחת ער"ן רגילה.

קיימת אפשרות לקחת פרטים מהפונים המעוניינים בכך, על מנת לקבל המשך טיפול מקצועי <strong>בעמותת דובדבן</strong>, כמפורט בדף המידע.</p>
<div class="divider"></div>
<div class="msg-actions">
  <button class="btn btn-secondary" onclick="PdfViewer.openDoc('פרטי קשר לארגוני סיוע')">📄 פתח דף מידע</button>
</div>`
  }
];

// ── Default Links ────────────────────────────────────────────────────────
const DEFAULT_LINKS = [
  { id: 'link_default_1', isDefault: true, icon: '🖥', title: 'פורטל ער"ן',      url: 'https://portal.eran.org.il/CallCenter/login.aspx?ReturnUrl=%2fCallCenter%2fdefault.aspx' },
  { id: 'link_default_2', isDefault: true, icon: '⚖️', title: 'כל זכות',         url: 'https://www.kolzchut.org.il/he/%D7%A2%D7%9E%D7%95%D7%93_%D7%A8%D7%90%D7%A9%D7%99' },
  { id: 'link_default_3', isDefault: true, icon: '🌐', title: 'אתר ער"ן ישראל', url: 'https://www.eran.org.il/' },
];

// ── Default Documents ───────────────────────────────────────────────────
const DEFAULT_DOCS = [
  { id: 'doc_default_1', isDefault: true, title: 'מה תאמר לאדם שעל הגג',              key: 'מה תאמר לאדם שעל הגג' },
  { id: 'doc_default_2', isDefault: true, title: 'התמודדות עם פונים חוזרים',          key: 'התמודדות עם פונים חוזרים' },
  { id: 'doc_default_3', isDefault: true, title: 'פרטי קשר לארגוני סיוע',            key: 'פרטי קשר לארגוני סיוע' },
  { id: 'doc_default_4', isDefault: true, title: 'פתיחת שיחה יזומה — כוננים',       key: 'פתיחת שיחה יזומה — כוננים' },
  { id: 'doc_default_5', isDefault: true, title: 'תרשים זרימה ופרוטוקול שיחה אובדנית', key: 'תרשים זרימה ופרוטוקול שיחה אובדנית' },
  { id: 'doc_default_6', isDefault: true, title: 'מדריך למתנדב צפ״א - פברואר 26',      key: 'מדריך למתנדב צפ״א - פברואר 26' },
];
