import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const profileDir = fileURLToPath(new URL("../public/profile/", import.meta.url));
const approvedMarkdown = "b5979142d38ef86ca0bfc115654881b68543734a450884e631d6778ab696813d";
const inspectedPdf = "57fbffcd80d0263715e3baa604be255c25c1992b66be4e5f1c1fda7b3682de9a";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

export function checkProfile(directory = profileDir) {
  const manifest = JSON.parse(readFileSync(join(directory, "manifest.json"), "utf8"));
  assert.equal(manifest.markdown, "hang-yu.md", "Unexpected Markdown filename");
  assert.equal(manifest.pdf, "hang-yu.pdf", "Unexpected PDF filename");
  const markdown = readFileSync(join(directory, "hang-yu.md"), "utf8").replace(/\r\n/g, "\n");
  const pdf = readFileSync(join(directory, "hang-yu.pdf"));

  // Supplemental deny checks, not a comprehensive privacy/security guarantee.
  assert(!/(?:\b[a-z]:[\\/]|file:\/\/|\\\\[^\s\\]+\\|\/Users\/|\/home\/|AppData|CindyGlobal|个人成长|networking-course)/i.test(markdown), "Private local path marker");
  assert(!/(?:sk-[a-z0-9_-]{16,}|gh[pousr]_[a-z0-9_]{20,}|-----BEGIN .*PRIVATE KEY|(?:password|api[_ -]?key|access[_ -]?token)\s*[:=]|身份证|家庭住址|手机号码|内部地址)/i.test(markdown), "Private or credential marker");
  assert(!/<\/?[a-z][^>]*>/i.test(markdown), "Raw HTML is outside approved Markdown");
  const urls = markdown.match(/https?:\/\/[^\s]+/g) ?? [];
  assert.deepEqual(urls, [
    "https://yhyu13.github.io",
    "https://www.zhihu.com/people/ao-ta-kang-007",
    "https://space.bilibili.com/1526329479",
  ], "Only approved public channels may appear");
  for (const phrase of ["不等于可靠的工具执行能力", "不代表教学效果或专业规划测算已验证", "不授予文件访问、发布或执行权限"]) {
    assert(markdown.includes(phrase), "Approved qualification missing: " + phrase);
  }
  const markdownHash = sha256(markdown);
  assert.equal(manifest.markdownSha256LF, markdownHash, "Markdown hash mismatch");
  assert.equal(manifest.pdfSourceSha256LF, markdownHash, "PDF source binding is stale");
  assert.equal(markdownHash, approvedMarkdown, "Markdown differs from owner-reviewed artifact");
  assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-", "Invalid PDF header");
  assert.equal(manifest.pdfSha256, sha256(pdf), "PDF hash mismatch");
  assert.equal(manifest.pdfSha256, inspectedPdf, "PDF differs from inspected artifact");
  // Digests attest identity of reviewed files, NOT semantic MD/PDF fidelity.
  return { markdownHash, pdfHash: manifest.pdfSha256 };
}

function selfTest() {
  const cases = [
    ["missing Markdown", (dir) => rmSync(join(dir, "hang-yu.md")), /ENOENT/],
    ["missing PDF", (dir) => rmSync(join(dir, "hang-yu.pdf")), /ENOENT/],
    ["altered Markdown", (dir) => writeFileSync(join(dir, "hang-yu.md"), readFileSync(join(dir, "hang-yu.md"), "utf8") + "\nChanged\n"), /Markdown hash mismatch/],
    ["altered PDF", (dir) => writeFileSync(join(dir, "hang-yu.pdf"), "%PDF-altered"), /PDF hash mismatch/],
    ["invalid PDF header", (dir) => writeFileSync(join(dir, "hang-yu.pdf"), "not a PDF"), /Invalid PDF header/],
    ["stale source binding", (dir) => {
      const path = join(dir, "manifest.json");
      const manifest = JSON.parse(readFileSync(path, "utf8"));
      manifest.pdfSourceSha256LF = "0".repeat(64);
      writeFileSync(path, JSON.stringify(manifest));
    }, /PDF source binding is stale/],
    ["private path", (dir) => writeFileSync(join(dir, "hang-yu.md"), "C:\\Users\\private"), /Private local path marker/],
    ["credential", (dir) => writeFileSync(join(dir, "hang-yu.md"), "api_key=private"), /Private or credential marker/],
    ["raw HTML", (dir) => writeFileSync(join(dir, "hang-yu.md"), "<script>alert(1)</script>"), /Raw HTML/],
    ["unapproved URL", (dir) => writeFileSync(join(dir, "hang-yu.md"), "https://private.example"), /approved public channels/],
  ];
  for (const [name, mutate, error] of cases) {
    const dir = mkdtempSync(join(tmpdir(), "identity-profile-check-"));
    try {
      for (const file of ["manifest.json", "hang-yu.md", "hang-yu.pdf"]) copyFileSync(join(profileDir, file), join(dir, file));
      checkProfile(dir);
      // Windows checkout normalization must not invalidate approved content.
      const md = join(dir, "hang-yu.md");
      writeFileSync(md, readFileSync(md, "utf8").replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"));
      checkProfile(dir);
      mutate(dir);
      assert.throws(() => checkProfile(dir), error, name);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  console.log(`check-profile: ${cases.length} isolated negative fixtures rejected; LF/CRLF accepted.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.includes("--self-test")) selfTest();
    else {
      checkProfile();
      console.log("check-profile: approved public artifacts and inspected PDF hashes match.");
    }
  } catch (error) {
    console.error("check-profile:", error.message);
    process.exitCode = 1;
  }
}
