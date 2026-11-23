<div dir="rtl" align="right">

# دليل النشر المباشر على Vercel — منصة رواسي العمر
**تاريخ التجهيز:** 2026-11-23  
**الحالة:** جاهز للنشر السحابي الفوري (`100% Vercel Ready`)  
**مستودع المشروع:** `https://github.com/alghzwanyk6-tech/rawasi-alaomer`

---

## 1. الخيار الأول: النشر عبر Vercel Dashboard (إذا عملت Fork بحسابك)

1. **اعمل Fork للمستودع بحساب GitHub الخاص بك**:
   - افتح: `https://github.com/alghzwanyk6-tech/rawasi-alaomer`
   - اضغط **Fork** ➔ **Create Fork**.
2. **استيراد المشروع في Vercel**:
   - ادخل إلى [vercel.com/new](https://vercel.com/new).
   - اختر مستودع `rawasi-alaomer` من قائمتك واضغط **Import**.
3. **لصق متغيرات البيئة (Environment Variables)**:
   - انسخ الكتلة أدناه والصقها في خانة `Environment Variables` في Vercel (يدعم Vercel لصق الكتلة كاملة دفعة واحدة):

```env
NEXT_PUBLIC_SUPABASE_URL=https://qghyfyktqibycanncbkk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rI6YTXD4DJHrxpoyK20sKQ_IaC60NZz
SUPABASE_SERVICE_ROLE_KEY=sb_secret_Dva_Csq9lZY5sJju9FtBxg_Du-PEnTM
SUPABASE_URL=https://qghyfyktqibycanncbkk.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_rI6YTXD4DJHrxpoyK20sKQ_IaC60NZz
SUPABASE_SECRET_KEY=sb_secret_Dva_Csq9lZY5sJju9FtBxg_Du-PEnTM
```

4. اضغط **Deploy**.

---

## 2. الخيار الثاني: النشر المباشر عبر Vercel CLI (بدون GitHub إطلاقاً)

إذا أردت رفع المشروع فوراً من جهازك إلى حسابك في Vercel دون التعامل مع GitHub:

1. افتح نافذة الأوامر (PowerShell أو Terminal) في مجلد المشروع:
   ```bash
   cd d:\DEV\ACTIVE\rawasialomar
   npx vercel
   ```
2. سيطلب منك تسجيل الدخول عبر المتصفح: اختر حساب Vercel الخاص بك.
3. أجب عن الأسئلة:
   - `Set up and deploy?` ➔ اكتب `y` ثم اضغط Enter.
   - `Which scope?` ➔ اختر حسابك الشخصي.
   - `Link to existing project?` ➔ اكتب `n`.
   - `Project name?` ➔ اضغط Enter (سيقترح `rawasi-alaomer`).
   - `In which directory is your code located?` ➔ اضغط Enter (`./`).
   - `Want to modify settings?` ➔ اكتب `n`.
4. بعد اكتمال الرفع، أضف المتغيرات بأمر واحد:
   ```bash
   npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
   npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
   ```
   أو أضفها عبر صفحة المشروع في Vercel Dashboard (`Settings -> Environment Variables`).
5. للنشر للإنتاج (`Production`):
   ```bash
   npx vercel --prod
   ```

---

## 3. التحقق بعد النشر
بمجرد ظهور رابط المشروع (مثلاً: `https://rawasi-alaomer.vercel.app`):
- افتح صفحة الفحص الحي:  
  `https://your-domain.vercel.app/api/health/supabase`
  ستظهر لك نتيجة فحص قاعدة البيانات وتأكيد اتصال الجداول الـ 14 بنجاح.
- جرّب الدخول للوحة التحكم:  
  `https://your-domain.vercel.app/login`
  باستخدام أزرار الدخول الفوري السريع أو كلمة المرور: `Rawasi@2026!`.

</div>
