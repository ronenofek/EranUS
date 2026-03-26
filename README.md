# פורטל המתנדבים — ארצות הברית 🇺🇸

פורטל פנימי למתנדבי ער"ן ארה"ב. מספק גישה מרכזית להודעות, מסמכים וקישורים רלוונטיים לעבודת השיחות.

🔗 **כתובת הפורטל:** https://ronenofek.github.io/EranUS/

---

## מבנה המערכת

| רכיב | תיאור |
|---|---|
| Firebase Auth | התחברות עם מייל וסיסמה |
| Firestore | אחסון הודעות, מסמכים, קישורים ומשתמשים |
| Firebase Storage | קבצי PDF למסמכים |
| GitHub Pages | אחסון סטטי של הממשק |

---

## תכונות

### למתנדבים
- **הודעות וחידודים** — כרטיסי הודעות הניתנים להרחבה, נעוצות מופיעות ראשונות עם תגית 📌
- **מסמכים** — צפייה בקובצי PDF ישירות בדפדפן
- **קישורים וכלים** — גישה מהירה לפורטל ער"ן, כל זכות, אתר ער"ן ולוח השנה
- **חיפוש חכם** — חיפוש בהודעות, מסמכים וכל זכות

### למנהלים
- **ניהול הודעות** — הוספה, מחיקה, נעיצה בראש הרשימה
- **ניהול מסמכים** — העלאת PDF חדשים, מחיקה
- **ניהול קישורים** — הוספה ומחיקה
- **ניהול משתמשים** — הוספה ידנית, ייבוא מקובץ CSV, עריכת תפקיד, השהיה, איפוס סיסמה

---

## מבנה הקוד

```
docs/
├── index.html                  # דף אחד — פורטל + פאנל ניהול
├── css/
│   ├── variables.css           # CSS custom properties
│   ├── layout.css              # מבנה כללי, topbar, admin overlay
│   ├── components.css          # כרטיסים, טפסים, מודלים
│   └── views.css               # search modal, PDF viewer
└── js/
    ├── core/
    │   ├── firebase-init.js    # אתחול Firebase
    │   ├── auth.js             # התחברות והתנתקות
    │   ├── config.js           # הודעות/מסמכים/קישורים ברירת מחדל
    │   ├── storage.js          # קריאה וכתיבה ל-Firestore
    │   └── app.js              # bootstrap, admin overlay, calendar
    ├── features/
    │   ├── messages/
    │   │   ├── messages.js         # renderer
    │   │   └── message-admin.js    # הוספת הודעה
    │   ├── documents/
    │   │   ├── documents.js        # renderer
    │   │   ├── doc-admin.js        # העלאת PDF
    │   │   └── pdf-viewer.js       # מודל צפייה ב-PDF
    │   ├── links/
    │   │   ├── links.js            # renderer
    │   │   └── link-admin.js       # הוספת קישור
    │   ├── admin/
    │   │   ├── admin-panel.js      # רשימות ניהול + מחיקה
    │   │   └── user-admin.js       # ניהול משתמשים
    │   ├── search/
    │   │   ├── search-engine.js    # חיפוש טקסט
    │   │   └── pdf-extractor.js    # חיפוש בתוך PDF
    │   └── calendar/
    │       └── calendar.js         # לוח שנה
    └── ui/
        ├── helpers.js          # escHtml, toggleForm
        └── toast.js            # הודעות קצרות
```

---

## הגדרת Firebase

פרויקט Firebase: `eranus-36ae6`

ב-Firestore נדרשים האוספים הבאים:
- `messages` — הודעות מותאמות אישית
- `documents` — מסמכי PDF (URL ל-Storage)
- `links` — קישורים חיצוניים
- `users` — רשומות משתמשים (תפקיד, סטטוס)
- `config/defaults` — מסמך עם מערכי `deletedMsgIds`, `deletedDocIds`, `deletedLinkIds`

---

## פריסה

הפורטל מתפרס אוטומטית ל-GitHub Pages מה-branch `main`, תיקייה `docs/`.

לפרסום שינויים:
```bash
git add .
git commit -m "תיאור השינוי"
git push
```
