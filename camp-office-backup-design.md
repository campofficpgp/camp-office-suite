# Backup اور Data Safety — Backup Center ڈیزائن (مرحلہ 10)
**مرحلہ:** صرف Design — ابھی کوئی implementation نہیں کی گئی۔ ساتھ ایک working نمونہ (prototype) بھی بھیجا جا رہا ہے۔

---

## 1) موجودہ پیٹرن — کیا پہلے سے اچھا ہے (برقرار رکھا جائے)

کوڈ چیک کیا: ہر موجودہ سسٹم میں پہلے سے ایک "Backup (save file)" اور "Restore from file" بٹن ہے:

- ✅ **Restore صرف Admin کر سکتا ہے** — کوڈ میں خود چیک ہے: *"Only an Administrator can restore a backup"*۔ آپ کا اصول "Restore صرف authorized admin کے لیے ہو" پہلے سے پورا ہو رہا ہے۔
- ✅ **Overwrite سے پہلے تصدیق** — کوڈ میں خود confirmation ہے: *"Restoring will replace the shared online data for EVERYONE... Continue?"*۔ آپ کا اصول "Overwrite سے پہلے confirmation ضروری ہو" بھی پہلے سے پورا ہو رہا ہے۔

دونوں موجودہ، آزمودہ فیچرز ہیں — نئے یکجا Backup Center میں یہی اصول برقرار رکھے جائیں گے، صرف اب نئے normalized ڈھانچے (Stage 4) کے مطابق بہتر بنائے جائیں گے۔

**ایک خامی جو ٹھیک کی جا رہی ہے:** موجودہ Backup صرف اس سسٹم کا ایک بڑا JSON (`STATE`) ڈاؤن لوڈ کرتا ہے — Documents/تصاویر کی اصل فائلیں (جو Cloudinary پر ہیں) اس میں شامل نہیں ہوتیں، صرف ان کے لنکس۔ Last successful backup کی تاریخ/وقت بھی کہیں محفوظ نہیں ہوتی۔ Restore بھی پرانے "ایک بڑا document" ڈھانچے پر بنا ہے — نئے normalized Collections کے مطابق اپڈیٹ کرنا ضروری ہے۔

---

## 2) نیا، یکجا Backup Center — مطلوبہ Options

| Option | تفصیل | طریقہ |
|---|---|---|
| **Database Backup/Export** | تمام Collections (Cases, Hearings, Results, Employees, Users, وغیرہ) کا مکمل JSON — ایک کلک میں | موجودہ پیٹرن کا وسیع ورژن — ہر Collection الگ سے پڑھ کر ایک JSON فائل میں |
| **Cases Export** | صرف Case سے متعلقہ ڈیٹا (Cases + Parties + Hearings + Results) — رپورٹ کے قابلِ استعمال شکل میں | Stage 8 کے Excel پیٹرن سے (SheetJS، ہر قسم اپنی sheet) |
| **Documents Backup** | Cloudinary پر موجود فائلوں کی مکمل فہرست (لنک + کس کیس سے جڑی + تاریخ) — بطور CSV/Excel؛ اصل فائلیں ڈاؤن لوڈ کرنے کا اختیاری، الگ "Advanced" آپشن (نیچے نوٹ دیکھیں) | فہرست: فوری۔ اصل فائلیں: تھوڑا پیچیدہ (نیچے دیکھیں) |
| **CSV/Excel export/PDF/Word** | وہی Stage 8 کے Export بٹن یہاں بھی دستیاب — پورے Database یا منتخب حصے کے لیے | موجودہ پیٹرن دوبارہ استعمال |
| **Backup Date/Time** | ہر بیک اپ لینے کی تاریخ/وقت خودکار محفوظ ہو | نیا — `backupLog` Collection |
| **Last Successful Backup** | Backup Center کے اوپر واضح نظر آئے: "آخری بیک اپ: 21 ستمبر 2026، 3:45 PM، بذریعہ افتخار احمد" | `backupLog` سے تازہ ترین ریکارڈ |
| **Restore Instructions** | صفحے پر ہی، FAQ کی طرز پر، مرحلہ وار ہدایات (نیچے سیکشن 4 دیکھیں) | موجودہ FAQ accordion پیٹرن سے |

### Documents Backup — تفصیلی نوٹ

Cloudinary پر فائلوں کی **فہرست** (لنک + میٹا ڈیٹا) نکالنا آسان ہے — سیدھا Firestore سے۔ مگر اصل فائلیں **ایک ساتھ ZIP کر کے ڈاؤن لوڈ** کرنا Cloudinary کے Admin API سے ہوتا ہے، جس کے لیے API Secret درکار ہے — اور Stage 9 کے اصول کے مطابق **API Secret کبھی بھی کلائنٹ (براؤزر) کوڈ میں نہیں آ سکتی**۔ اس لیے:
- **فوری/سادہ:** فائلوں کی فہرست (لنکس کے ساتھ) Export ہو — کوئی نیا سرور درکار نہیں۔
- **اختیاری/Advanced:** اگر مستقبل میں تمام فائلیں ایک ZIP میں چاہیے ہوں، تو ایک چھوٹا، محفوظ Cloud Function (سرور کی طرف) بنانا ہوگا جو وہاں API Secret استعمال کرے — یہ ایک الگ، چھوٹا مستقبل کا قدم ہے، ابھی کی ضرورت کے لیے فہرست کافی ہے۔ Cloudinary خود بھی اپنی سطح پر backup/retention رکھتا ہے۔

---

## 3) Database — نئی Entity

| پہلو | تفصیل |
|---|---|
| **Name** | `backupLog` |
| **Primary ID** | auto-ID → `logId` |
| **Required fields** | `type` (`database`/`casesExport`/`documentsListExport`), `performedByUserId` (ref → users), `timestamp` |
| **Optional fields** | `recordCounts` (کتنے ریکارڈ شامل تھے، مثلاً `{cases: 1200, employees: 15}`)، `fileSizeApprox` |
| **Relationships** | `performedByUserId` → `users.id` |
| **Indexes/Search** | `timestamp` (تازہ ترین پہلے، "Last successful backup" کے لیے)، `type` |
| **Timestamps** | صرف `timestamp` — یہ ریکارڈ کبھی update نہیں ہوگا |
| **Soft-delete؟** | **ضروری نہیں** — یہ خود ایک لاگ ہے، Audit Log کی طرح مستقل رہے |

**Firestore Rule:** `backupLog` پر `create` جب بھی کوئی Admin/Super Admin بیک اپ لے (خودکار)؛ `read` صرف Admin/اوپر — بالکل `auditLog` جیسا پیٹرن (Stage 9 دیکھیں)۔

---

## 4) Restore Instructions — UI میں دکھائی جانے والی ہدایات

Backup Center کے صفحے پر، Restore بٹن کے ساتھ ہی ایک واضح، مرحلہ وار گائیڈ:

1. **صرف Administrator/Super Admin یہ کر سکتے ہیں** — عام صارف کو یہ بٹن نظر ہی نہیں آئے گا۔
2. "Restore from file" پر کلک کریں اور اپنی محفوظ کردہ Backup فائل (`.json`) منتخب کریں۔
3. سسٹم فائل چیک کرے گا (کیا یہ ایک درست Backup فائل ہے) — اگر نہیں تو صاف پیغام دے کر روک دے گا۔
4. ایک واضح تصدیقی پیغام آئے گا: **"یہ عمل موجودہ تمام آن لائن ڈیٹا کو اس بیک اپ فائل سے بدل دے گا — یہ ناقابلِ واپسی ہے۔ کیا آپ واقعی جاری رکھنا چاہتے ہیں؟"** — صرف "ہاں، جاری رکھیں" پر آگے بڑھے۔
5. Restore سے پہلے سسٹم **خودکار طور پر موجودہ ڈیٹا کا ایک "پہلے کا" بیک اپ خود بنا لے** (حفاظتی تدبیر — اگر Restore غلط فائل سے ہو جائے تو واپس جایا جا سکے)۔
6. Restore مکمل ہونے پر واضح پیغام + `backupLog`/`auditLog` دونوں میں اندراج۔

---

## اگلا قدم

یہ صرف Design ہے۔ ساتھ ایک working prototype بھی بھیجا جا رہا ہے (Backup Center کا مکمل صفحہ — نقلی ڈیٹا پر، Admin/غیر-Admin دونوں کا منظر دکھاتا ہوا) — دیکھ کر رائے دیجیے، اس کے بعد ہی اصل سسٹم میں شامل ہوگا۔
