import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../data/profile";

// Deliberately restricted Markdown. React escapes everything else, including
// HTML, links and unsupported syntax; no HTML injection or URL interpretation.
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

function ProfileText({ markdown }: { markdown: string }) {
  return markdown.replace(/\r\n/g, "\n").trim().split(/\n\s*\n/).map((block, i) => {
    if (block.startsWith("# ")) return <h3 key={i}>{inline(block.slice(2))}</h3>;
    if (block.startsWith("## ")) return <h4 key={i}>{inline(block.slice(3))}</h4>;
    if (block.split("\n").every((line) => line.startsWith("- "))) {
      return <ul key={i}>{block.split("\n").map((line, j) => <li key={j}>{inline(line.slice(2))}</li>)}</ul>;
    }
    if (block.startsWith("> ")) return <blockquote key={i}>{inline(block.slice(2))}</blockquote>;
    return <p key={i}>{inline(block)}</p>;
  });
}

export function IdentityProfile() {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [copying, setCopying] = useState(false);
  const [fallback, setFallback] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const lifetime = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    lifetime.current = controller;
    setFailed(false);
    setMarkdown(null);
    setFeedback("");
    setFallback(false);
    async function load() {
      try {
        const response = await fetch(PROFILE.markdown, { signal: controller.signal });
        if (!response.ok) throw new Error("Profile request failed");
        const text = await response.text();
        // A static-host SPA fallback is not the public Markdown document.
        if (!text.startsWith("# ")) throw new Error("Invalid profile response");
        if (!controller.signal.aborted) setMarkdown(text);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (fallback) {
      textarea.current?.focus();
      textarea.current?.select();
    }
  }, [fallback]);

  async function copy() {
    if (markdown === null || copying) return;
    const signal = lifetime.current?.signal;
    setCopying(true);
    setFeedback("");
    setFallback(false);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(markdown);
      if (!signal?.aborted) setFeedback("已复制公开介绍，可粘贴给 Agent。");
    } catch {
      if (!signal?.aborted) {
        setFeedback("自动复制不可用，请在下方选取并手动复制 Markdown。");
        setFallback(true);
      }
    } finally {
      if (!signal?.aborted) setCopying(false);
    }
  }

  return (
    <section className="identity-profile" aria-label="公开个人介绍" lang="zh-CN">
      <div className="profile-actions" aria-label="公开介绍分享">
        <a className="pill" href={PROFILE.pdf} download="hang-yu.pdf">下载 PDF</a>
        <a className="pill" href={PROFILE.markdown} download="hang-yu.md">下载 Markdown</a>
        <button className="pill" type="button" onClick={() => void copy()} disabled={markdown === null || copying}>
          {copying ? "正在复制…" : "复制给 Agent"}
        </button>
      </div>
      <p className="profile-status" role="status" aria-live="polite">
        {failed ? "公开介绍加载失败，请重试；仍可下载文件。" : markdown === null ? "正在加载公开介绍…" : feedback}
      </p>
      {failed && <button className="pill" type="button" onClick={() => setAttempt((value) => value + 1)}>重新加载</button>}
      {fallback && <label className="profile-fallback">手动复制 Markdown
        <textarea ref={textarea} readOnly value={markdown ?? ""} rows={12} />
      </label>}
      {markdown !== null && <article className="profile-text"><ProfileText markdown={markdown} /></article>}
    </section>
  );
}
