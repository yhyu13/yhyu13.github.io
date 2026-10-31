import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Library } from "./pages/Library";
import { ArticlePage } from "./pages/ArticlePage";
import { DeckReader } from "./components/DeckReader";

const CoursePage = lazy(() =>
  import("./pages/CoursePage").then((m) => ({ default: m.CoursePage })),
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Library />} />
      <Route path="/identity" element={<Library openId="identity" />} />
      <Route path="/craft" element={<Library openId="craft" />} />
      <Route path="/archive" element={<Library openId="archive" />} />
      <Route path="/archive/capsule" element={<ArticlePage slug="capsule" />} />
      <Route path="/archive/rainbow" element={<ArticlePage slug="rainbow" />} />
      <Route path="/decks" element={<Library openId="decks" />} />
      <Route path="/decks/:slug" element={<DeckReader />} />
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
