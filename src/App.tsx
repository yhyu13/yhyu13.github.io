import { Navigate, Route, Routes } from "react-router-dom";
import { Library } from "./pages/Library";
import { ArticlePage } from "./pages/ArticlePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Library />} />
      <Route path="/identity" element={<Library openId="identity" />} />
      <Route path="/craft" element={<Library openId="craft" />} />
      <Route path="/archive" element={<Library openId="archive" />} />
      <Route path="/archive/capsule" element={<ArticlePage slug="capsule" />} />
      <Route path="/archive/rainbow" element={<ArticlePage slug="rainbow" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
