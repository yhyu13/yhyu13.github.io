import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShareDialog } from "../components/ShareDialog";
import { ShareTrigger } from "../components/ShareTrigger";
import { getShareEntry } from "../data/share";
import { getArchivePost, type ArchivePost } from "../data/archivePosts";

export function ArticlePage({ slug }: { slug: ArchivePost["slug"] }) {
  const post = getArchivePost(slug);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    document.title = post ? `${post.title} · Hang Yu` : "Hang Yu";
    document.body.dataset.mode = "gallery";
    document.body.dataset.menu = "closed";
    return () => {
      document.title = "Hang Yu";
    };
  }, [post]);

  if (!post) return null;

  return (
    <article className="article-page">
      <div className="article-toolbar">
        <Link className="article-back" to="/archive">
          ← Archive
        </Link>
        <div className="article-toolbar-actions">
          <Link className="article-back" to="/browse">
            ⌕ Index
          </Link>
          <ShareTrigger onClick={() => setShareOpen(true)} />
        </div>
      </div>
      <div className="article-inner">
        <p className="article-kicker">Field Notes · {post.date.slice(0, 4)}</p>
        <h1>{post.title}</h1>
        <p className="article-meta">
          {post.date}
          {post.authors ? ` · ${post.authors}` : ""}
        </p>
        <div className="article-body">{post.body}</div>
        <p className="article-tags">
          {post.tags.map((tag) => (
            <span key={tag}># {tag}</span>
          ))}
        </p>
      </div>
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} entry={getShareEntry(`/archive/${slug}`)} />
    </article>
  );
}
