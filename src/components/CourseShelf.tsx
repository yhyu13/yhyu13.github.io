import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COURSES, type Course } from "../data/courses";

type CourseManifest = {
  groups: Record<string, { label: string; href: string }[]>;
};

export function CourseShelf() {
  const shelfRef = useRef<HTMLElement>(null);

  // The overview is the only scrollable element on this page; make the wheel
  // work anywhere (over the hero book / empty space too), not just over the panel.
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const onWheel = (e: WheelEvent) => {
      if (e.target instanceof Node && shelf.contains(e.target)) return; // native scroll over the panel
      if (shelf.scrollHeight <= shelf.clientHeight) return; // nothing to scroll (e.g. mobile page-scroll layout)
      const dy = e.deltaY;
      const atTop = shelf.scrollTop <= 0;
      const atBottom = shelf.scrollTop + shelf.clientHeight >= shelf.scrollHeight;
      if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) {
        shelf.scrollTop += dy;
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className="course-shelf" ref={shelfRef} aria-label="Courses">
      <h2 className="detail-title">Courses</h2>
      <p className="detail-description">
        网课学习包：可交互的学习站、讲义、带旁白的视频，以及课程的文字层。
      </p>
      <div className="course-grid">
        {COURSES.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const [counts, setCounts] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    fetch(`/courses/${course.slug}/files/manifest.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CourseManifest | null) => {
        if (cancelled || !data) return;
        const decks = data.groups.decks?.length ?? 0;
        const videos = data.groups.videos?.length ?? 0;
        setCounts(`${decks} 份讲义 · ${videos} 段视频`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [course.slug]);

  return (
    <article className="course-card">
      <Link
        className="course-card-cover"
        to={`/courses/${course.slug}`}
        aria-label={`Open ${course.title}`}
        style={{ ["--cover-color" as string]: course.color ?? "#3f5b63" }}
      >
        <span className="course-card-kicker">{course.term}</span>
        <span className="course-card-title">{course.title}</span>
        <span className="course-card-meta">
          {course.institution} · {course.instructor}
        </span>
      </Link>
      <div className="course-card-body">
        <p className="course-card-desc">{course.sections[0]?.description ?? ""}</p>
        {counts ? <p className="course-card-counts">{counts}</p> : null}
        <div className="action-rail">
          <Link className="pill" to={`/courses/${course.slug}`}>
            Open
          </Link>
        </div>
      </div>
    </article>
  );
}
