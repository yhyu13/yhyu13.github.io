import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getArchivePost, type ArchivePost } from "../data/archivePosts";

export function ArticlePage({ slug }: { slug: ArchivePost["slug"] }) {
  const post = getArchivePost(slug);

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
      <div className="article-inner">
        <Link className="article-back" to="/archive">
          ← Archive
        </Link>
        <p className="article-kicker">Field Notes · 2017</p>
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
    </article>
  );
}
