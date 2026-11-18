import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Library } from "./pages/Library";

// pdf.js is only needed on a deck detail route. Importing the reader eagerly
// pulled it into the entry chunk, so every route (Archive included) paid for it.
const DeckReader = lazy(() =>
  import("./components/DeckReader").then((m) => ({ default: m.DeckReader })),
);

const CoursePage = lazy(() =>
  import("./pages/CoursePage").then((m) => ({ default: m.CoursePage })),
);

// Archive posts are reading pages with a lot of JSX; they belong in their own
// chunk so the shelf routes do not carry them.
const ArticlePage = lazy(() =>
  import("./pages/ArticlePage").then((m) => ({ default: m.ArticlePage })),
);

// One screen listing every deck, course, work and note.
const BrowsePage = lazy(() =>
  import("./pages/BrowsePage").then((m) => ({ default: m.BrowsePage })),
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Library />} />
      <Route
        path="/browse"
        element={
          <Suspense fallback={null}>
            <BrowsePage />
          </Suspense>
        }
      />
      <Route path="/identity" element={<Library openId="identity" />} />
      <Route path="/craft" element={<Library openId="craft" />} />
      <Route path="/archive" element={<Library openId="archive" />} />
      <Route
        path="/archive/capsule"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="capsule" />
          </Suspense>
        }
      />
      <Route
        path="/archive/rainbow"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="rainbow" />
          </Suspense>
        }
      />
      <Route
        path="/archive/a16z-agent-architecture"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="a16z-agent-architecture" />
          </Suspense>
        }
      />
      <Route
        path="/archive/mutation-testing"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="mutation-testing" />
          </Suspense>
        }
      />
      <Route
        path="/archive/ue5-lighting"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="ue5-lighting" />
          </Suspense>
        }
      />
      <Route
        path="/archive/scene-3d-pipeline"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="scene-3d-pipeline" />
          </Suspense>
        }
      />
      <Route
        path="/archive/stageshow-teardown"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="stageshow-teardown" />
          </Suspense>
        }
      />
      <Route
        path="/archive/ai-tutor"
        element={
          <Suspense fallback={null}>
            <ArticlePage slug="ai-tutor" />
          </Suspense>
        }
      />
      <Route path="/decks" element={<Library openId="decks" />} />
      <Route
        path="/decks/:slug"
        element={
          <Suspense fallback={null}>
            <DeckReader />
          </Suspense>
        }
      />
      <Route path="/courses" element={<Library openId="courses" />} />
      <Route
        path="/courses/:slug"
        element={
          <Suspense fallback={null}>
            <CoursePage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
