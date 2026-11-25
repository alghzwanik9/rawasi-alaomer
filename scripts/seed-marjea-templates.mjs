import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { PROCEDURES_DATA } from "../src/data/marjeaSeed.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// Environment Variables Loading
// -----------------------------------------------------------------------------
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const idx = line.indexOf("=");
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    env[key] = val;
  }
  return env;
}

const env = {
  ...loadEnvFile(path.resolve(__dirname, "../.env.local")),
  ...process.env,
};

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

// Valid JWT key recognized by Supabase Storage gateway
const LEGACY_JWT_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaHlmeWt0cWlieWNhbm5jYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzMjQ5MjksImV4cCI6MjExMDkwMDkyOX0.pAsL6I8iYC9n42PEmGrPPDwu5RoAR6P9OuCjxnbC-6o";

const keyToUse =
  SERVICE_ROLE_KEY && SERVICE_ROLE_KEY.startsWith("ey")
    ? SERVICE_ROLE_KEY
    : LEGACY_JWT_KEY;

const supabase = createClient(SUPABASE_URL, keyToUse, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET_NAME = "marjea-templates";

// -----------------------------------------------------------------------------
// PKZIP In-Memory Generator (Clean, pure-Node standard uncompressed/stored zip)
// -----------------------------------------------------------------------------
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[i] = c >>> 0;
}

function calculateCrc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createZipBuffer(files) {
  const fileEntries = [];
  let offset = 0;
  const parts = [];

  for (const f of files) {
    const data = Buffer.isBuffer(f.data) ? f.data : Buffer.from(f.data, "utf8");
    const nameBuf = Buffer.from(f.path, "utf8");
    const crc = calculateCrc32(data);
    const size = data.length;

    // Local file header (30 bytes + name)
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
    localHeader.writeUInt16LE(20, 4);         // Version needed to extract (2.0)
    localHeader.writeUInt16LE(0, 6);          // General purpose bit flag
    localHeader.writeUInt16LE(0, 8);          // Compression method (0 = Stored)
    localHeader.writeUInt16LE(0, 10);         // Last mod file time
    localHeader.writeUInt16LE(0, 12);         // Last mod file date
    localHeader.writeUInt32LE(crc, 14);       // CRC-32
    localHeader.writeUInt32LE(size, 18);      // Compressed size
    localHeader.writeUInt32LE(size, 22);      // Uncompressed size
    localHeader.writeUInt16LE(nameBuf.length, 26); // File name length
    localHeader.writeUInt16LE(0, 28);         // Extra field length
    nameBuf.copy(localHeader, 30);

    parts.push(localHeader, data);
    fileEntries.push({ nameBuf, crc, size, offset });
    offset += localHeader.length + data.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;

  for (const entry of fileEntries) {
    // Central directory header (46 bytes + name)
    const cdHeader = Buffer.alloc(46 + entry.nameBuf.length);
    cdHeader.writeUInt32LE(0x02014b50, 0);   // Central directory signature
    cdHeader.writeUInt16LE(20, 4);           // Version made by
    cdHeader.writeUInt16LE(20, 6);           // Version needed to extract
    cdHeader.writeUInt16LE(0, 8);            // Bit flag
    cdHeader.writeUInt16LE(0, 10);           // Compression (0 = Stored)
    cdHeader.writeUInt16LE(0, 12);           // Mod time
    cdHeader.writeUInt16LE(0, 14);           // Mod date
    cdHeader.writeUInt32LE(entry.crc, 16);   // CRC-32
    cdHeader.writeUInt32LE(entry.size, 20);  // Compressed size
    cdHeader.writeUInt32LE(entry.size, 24);  // Uncompressed size
    cdHeader.writeUInt16LE(entry.nameBuf.length, 28); // File name length
    cdHeader.writeUInt16LE(0, 30);           // Extra field length
    cdHeader.writeUInt16LE(0, 32);           // Comment length
    cdHeader.writeUInt16LE(0, 34);           // Disk number start
    cdHeader.writeUInt16LE(0, 36);           // Internal file attributes
    cdHeader.writeUInt32LE(0, 38);           // External file attributes
    cdHeader.writeUInt32LE(entry.offset, 42);// Relative offset of local header
    entry.nameBuf.copy(cdHeader, 46);

    parts.push(cdHeader);
    centralDirSize += cdHeader.length;
  }

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);          // EOCD signature
  eocd.writeUInt16LE(0, 4);                   // Disk number
  eocd.writeUInt16LE(0, 6);                   // Start disk number
  eocd.writeUInt16LE(fileEntries.length, 8);  // Number of entries on this disk
  eocd.writeUInt16LE(fileEntries.length, 10); // Total entries
  eocd.writeUInt32LE(centralDirSize, 12);     // Central directory size
  eocd.writeUInt32LE(centralDirOffset, 16);   // Central directory offset
  eocd.writeUInt16LE(0, 20);                  // Comment length

  parts.push(eocd);
  return Buffer.concat(parts);
}

// -----------------------------------------------------------------------------
// Document Builders: Valid DOCX, XLSX, and PDF
// -----------------------------------------------------------------------------
function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildDocx(tmpl, proc) {
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <!-- Header -->
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="163063"/><w:sz w:val="24"/><w:b/></w:rPr><w:t>رواسي العمر للاستشارات والتنفيذ المتكامل | مرجع الجمعيات الأهلية</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="47A3B8"/><w:sz w:val="20"/></w:rPr><w:t>المرجع الإجرائي: ${escapeXml(proc.code)} - ${escapeXml(proc.title)}</w:t></w:r>
    </w:p>
    <w:p><w:pPr><w:bidi/></w:pPr><w:r><w:t>------------------------------------------------------------------------------------------------------------------------</w:t></w:r></w:p>

    <!-- Document Title -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="163063"/><w:sz w:val="36"/><w:b/></w:rPr><w:t>${escapeXml(tmpl.title)}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="526071"/><w:sz w:val="22"/><w:i/></w:rPr><w:t>${escapeXml(tmpl.description)}</w:t></w:r>
    </w:p>
    <w:p><w:pPr><w:bidi/></w:pPr></w:p>

    <!-- Section 1: Metadata & Authority -->
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="2360A5"/><w:sz w:val="26"/><w:b/></w:rPr><w:t>أولاً: بيانات الاعتماد والجهة المشرفة</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>• الجهة المشرفة: ${escapeXml(proc.authority)}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>• زمن الإنجاز المتوقع: ${escapeXml(proc.expectedTime)}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>• حالة التحديث: ${escapeXml(proc.lastUpdated)}</w:t></w:r>
    </w:p>
    <w:p><w:pPr><w:bidi/></w:pPr></w:p>

    <!-- Section 2: Prerequisites -->
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="2360A5"/><w:sz w:val="26"/><w:b/></w:rPr><w:t>ثانياً: الاشتراطات والمتطلبات المسبقة</w:t></w:r>
    </w:p>
    ${proc.prerequisites.items
      .map(
        (it) => `
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>• ${escapeXml(it.headline)}: </w:t></w:r>
      <w:r><w:rPr><w:color w:val="526071"/><w:sz w:val="22"/></w:rPr><w:t>${escapeXml(it.detail)}</w:t></w:r>
    </w:p>`
      )
      .join("")}
    <w:p><w:pPr><w:bidi/></w:pPr></w:p>

    <!-- Section 3: Official Template Body -->
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="2360A5"/><w:sz w:val="26"/><w:b/></w:rPr><w:t>ثالثاً: البنود التنظيمية ومحضر القرار الرسمي</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>1. بناءً على الصلاحيات المخولة نظاماً بموجب اللائحة التنفيذية للجمعيات والمؤسسات الأهلية، تم إقرار هذا النموذج وتوثيقه رسمياً.</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>2. تتعهد الجمعية بمطابقة البيانات الواردة مع السجلات المعتمدة لدى المركز الوطني لتنمية القطاع غير الربحي والجهات ذات العلاقة.</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>3. يُعمل بهذا القرار من تاريخ صدوره وتُخطر الأطراف المعنية بنسخة رسمية منه للبدء بالتنفيذ.</w:t></w:r>
    </w:p>
    <w:p><w:pPr><w:bidi/></w:pPr></w:p>

    <!-- Signatures Block -->
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="163063"/><w:sz w:val="24"/><w:b/></w:rPr><w:t>المصادقة والتوقيع:</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>رئيس مجلس الإدارة / المفوض: ___________________________   التوقيع: ______________   التاريخ: ____/____/2026م</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>المشرف المالي / أمين السر: ___________________________   التوقيع: ______________   الختم الرسمي: [               ]</w:t></w:r>
    </w:p>
    <w:p><w:pPr><w:bidi/></w:pPr></w:p>

    <!-- Footer Note -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr>
      <w:r><w:rPr><w:color w:val="526071"/><w:sz w:val="18"/><w:i/></w:rPr><w:t>تم إعداد وتدقيق هذا النموذج بواسطة رواسي العمر للاستشارات والتنفيذ (جهة واحدة، مسار واضح) - rawasialomar.sa</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`;

  return createZipBuffer([
    { path: "[Content_Types].xml", data: contentTypesXml },
    { path: "_rels/.rels", data: relsXml },
    { path: "word/document.xml", data: docXml },
  ]);
}

function buildXlsx(tmpl, proc) {
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="الجدول المعتمد" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView tabSelected="1" workbookViewId="0" rightToLeft="1"/>
  </sheetViews>
  <sheetData>
    <!-- Row 1: Header Banner -->
    <row r="1">
      <c r="A1" t="inlineStr"><is><t>شركة رواسي العمر للاستشارات والتنفيذ المتكامل | مرجع الجمعيات الأهلية</t></is></c>
    </row>
    <!-- Row 2: Title -->
    <row r="2">
      <c r="A2" t="inlineStr"><is><t>${escapeXml(tmpl.title)}</t></is></c>
      <c r="B2" t="inlineStr"><is><t>كود: ${escapeXml(proc.code)}</t></is></c>
      <c r="C2" t="inlineStr"><is><t>التحديث: 2026م</t></is></c>
    </row>
    <!-- Row 3: Blank -->
    <row r="3"></row>
    <!-- Row 4: Column Headers -->
    <row r="4">
      <c r="A4" t="inlineStr"><is><t>م</t></is></c>
      <c r="B4" t="inlineStr"><is><t>البند / الإجراء التنفيذي</t></is></c>
      <c r="C4" t="inlineStr"><is><t>المرجع النظامي / السند</t></is></c>
      <c r="D4" t="inlineStr"><is><t>مسؤول التنفيذ المعتمد</t></is></c>
      <c r="E4" t="inlineStr"><is><t>الميزانية التقديرية (ر.س)</t></is></c>
      <c r="F4" t="inlineStr"><is><t>حالة الامتثال والاعتماد</t></is></c>
    </row>
    <!-- Rows 5..8: Seeded Data from Procedure Steps -->
    ${proc.steps
      .slice(0, 4)
      .map(
        (st, idx) => `
    <row r="${5 + idx}">
      <c r="A${5 + idx}" t="n"><v>${st.stepNumber}</v></c>
      <c r="B${5 + idx}" t="inlineStr"><is><t>${escapeXml(st.title)}</t></is></c>
      <c r="C${5 + idx}" t="inlineStr"><is><t>${escapeXml(st.officialInfo.reference)}</t></is></c>
      <c r="D${5 + idx}" t="inlineStr"><is><t>المشرف المالي / مجلس الإدارة</t></is></c>
      <c r="E${5 + idx}" t="n"><v>${(idx + 1) * 15000}</v></c>
      <c r="F${5 + idx}" t="inlineStr"><is><t>معتمد ومطابق</t></is></c>
    </row>`
      )
      .join("")}
    <!-- Summary Row -->
    <row r="9">
      <c r="B9" t="inlineStr"><is><t>إجمالي الموازنة / الاعتماد التقديري:</t></is></c>
      <c r="E9" t="inlineStr"><is><t>150,000 ر.س</t></is></c>
      <c r="F9" t="inlineStr"><is><t>جاهز للاعتماد النهائي</t></is></c>
    </row>
    <!-- Footer Note -->
    <row r="11">
      <c r="B11" t="inlineStr"><is><t>رواسي العمر - جهة واحدة، مسار واضح للتطوير والتنفيذ | هاتف: +966 57 599 9956 | rawasialomar.sa</t></is></c>
    </row>
  </sheetData>
</worksheet>`;

  return createZipBuffer([
    { path: "[Content_Types].xml", data: contentTypesXml },
    { path: "_rels/.rels", data: rootRelsXml },
    { path: "xl/_rels/workbook.xml.rels", data: workbookRelsXml },
    { path: "xl/workbook.xml", data: workbookXml },
    { path: "xl/worksheets/sheet1.xml", data: sheetXml },
  ]);
}

function buildPdf(tmpl, proc) {
  // Clean, standard PDF 1.4 document stream
  const contentStream = `
BT
/F1 16 Tf
50 780 Td
(Rawasi Al-Omar Consulting & Execution | Marjea Knowledge Base) Tj
0 -26 Td
/F1 13 Tf
(${proc.code} - ${tmpl.downloadFileName}) Tj
0 -24 Td
/F1 10 Tf
(Authority: National Center for Non-Profit Sector (NCNP)) Tj
0 -16 Td
(Expected Completion: ${proc.expectedTime}) Tj
0 -28 Td
/F1 14 Tf
(Template Specification: ${tmpl.title}) Tj
0 -20 Td
/F1 9 Tf
(Description: ${tmpl.description}) Tj
0 -30 Td
/F1 11 Tf
(Compliance Prerequisites:) Tj
${proc.prerequisites.items
  .slice(0, 3)
  .map(
    (it, idx) => `
0 -16 Td
([${idx + 1}] ${it.headline.replace(/[()]/g, "")}: ${it.detail.slice(0, 70).replace(/[()]/g, "")}) Tj`
  )
  .join("")}
0 -36 Td
/F1 11 Tf
(Authorized Execution Steps:) Tj
${proc.steps
  .slice(0, 4)
  .map(
    (st) => `
0 -16 Td
(- Step ${st.stepNumber}: ${st.title.replace(/[()]/g, "")} [${st.officialInfo.reference.replace(/[()]/g, "")}]) Tj`
  )
  .join("")}
0 -40 Td
/F1 10 Tf
(Official Authorization & Approval:) Tj
0 -18 Td
(Board Chairman / Authorized Officer: ___________________ Date: ___/___/2026) Tj
0 -16 Td
(Financial Supervisor / Secretary:   ___________________ Seal: [       ]) Tj
0 -35 Td
/F1 8 Tf
(Copyright 2026 Rawasi Al-Omar. Turnkey Consulting & Field Execution. rawasialomar.sa) Tj
ET
`.trim();

  const streamBytes = Buffer.from(contentStream, "utf8");

  const pdfParts = [
    "%PDF-1.4\n",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`,
    streamBytes,
    "\nendstream\nendobj\n",
  ];

  // Calculate offsets for XRef
  let currentOffset = 0;
  const offsets = [];
  offsets.push(0); // 0 obj

  let headBuf = Buffer.from("%PDF-1.4\n", "utf8");
  currentOffset += headBuf.length;

  offsets.push(currentOffset);
  let obj1 = Buffer.from("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n", "utf8");
  currentOffset += obj1.length;

  offsets.push(currentOffset);
  let obj2 = Buffer.from("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n", "utf8");
  currentOffset += obj2.length;

  offsets.push(currentOffset);
  let obj3 = Buffer.from(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`, "utf8");
  currentOffset += obj3.length;

  offsets.push(currentOffset);
  let obj4 = Buffer.from("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n", "utf8");
  currentOffset += obj4.length;

  offsets.push(currentOffset);
  let obj5Head = Buffer.from(`5 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`, "utf8");
  let obj5Tail = Buffer.from("\nendstream\nendobj\n", "utf8");
  currentOffset += obj5Head.length + streamBytes.length + obj5Tail.length;

  const xrefOffset = currentOffset;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.concat([
    headBuf,
    obj1,
    obj2,
    obj3,
    obj4,
    obj5Head,
    streamBytes,
    obj5Tail,
    Buffer.from(xref, "utf8"),
  ]);
}

// -----------------------------------------------------------------------------
// Main Provisioning & Seeding Routine
// -----------------------------------------------------------------------------
async function main() {
  console.log("==================================================================");
  console.log("🚀 Provisioning Real Supabase Storage Templates for /marjea");
  console.log("Bucket:", BUCKET_NAME);
  console.log("Supabase Project:", SUPABASE_URL);
  console.log("==================================================================\n");

  // 1. Ensure bucket exists and is public
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.warn("⚠️ Warning checking buckets:", listError.message);
  }

  const existingBucket = buckets?.find((b) => b.name === BUCKET_NAME);
  if (!existingBucket) {
    console.log(`📦 Creating public bucket '${BUCKET_NAME}'...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800,
    });
    if (createError) {
      console.warn("⚠️ Create bucket notice:", createError.message);
    } else {
      console.log("✅ Bucket created successfully.");
    }
  } else {
    console.log(`✅ Storage bucket '${BUCKET_NAME}' is ready.`);
  }

  // 2. Extract all 18 templates across the 6 procedures
  const allTemplates = [];
  for (const proc of PROCEDURES_DATA) {
    for (const tmpl of proc.templates) {
      allTemplates.push({ tmpl, proc });
    }
  }

  console.log(`\n📄 Generating and uploading ${allTemplates.length} real document templates...\n`);

  let successCount = 0;

async function uploadWithRetry(bucket, filename, fileBuffer, contentType, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (!error) return { data, error: null };
      if (attempt === maxRetries) return { data: null, error };
      console.warn(`   ⚠️ Retrying upload for ${filename} (attempt ${attempt + 1}/${maxRetries}): ${error.message}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    } catch (err) {
      if (attempt === maxRetries) return { data: null, error: err };
      console.warn(`   ⚠️ Retrying upload after exception for ${filename} (attempt ${attempt + 1}/${maxRetries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

  for (const { tmpl, proc } of allTemplates) {
    let fileBuffer;
    let contentType;

    if (tmpl.fileType === "DOCX") {
      fileBuffer = buildDocx(tmpl, proc);
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (tmpl.fileType === "XLSX") {
      fileBuffer = buildXlsx(tmpl, proc);
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else {
      fileBuffer = buildPdf(tmpl, proc);
      contentType = "application/pdf";
    }

    const filename = tmpl.downloadFileName;

    // Upload with retry and proper mime type
    const { error: uploadError } = await uploadWithRetry(
      BUCKET_NAME,
      filename,
      fileBuffer,
      contentType
    );

    if (uploadError) {
      console.error(`❌ Upload failed for ${filename}:`, uploadError.message);
    } else {
      successCount++;
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
      console.log(`✅ [${successCount}/${allTemplates.length}] Uploaded: ${filename} (${fileBuffer.length} bytes, ${contentType})`);
      console.log(`   Public URL: ${publicUrl}`);

      // Update public.procedure_templates table
      const { error: updateError } = await supabase
        .from("procedure_templates")
        .update({
          download_url: publicUrl,
          download_count: 0,
        })
        .eq("id", tmpl.id);

      if (updateError) {
        console.warn(`   ⚠️ Warning updating table for ${tmpl.id}:`, updateError.message);
      }
    }
  }

  console.log("\n==================================================================");
  console.log(`🎉 Success! Seeded ${successCount}/${allTemplates.length} real downloadable templates in Supabase Storage.`);
  console.log("==================================================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
