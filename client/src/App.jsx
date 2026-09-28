import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Problems from "./pages/Problems";
import Attempt from "./pages/Attempt";
import Result from "./pages/Result";
import Attempts from "./pages/Attempts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/problems" replace />} />
        <Route path="/problems" element={<Problems />} />
         <Route path="/problems/:slug" element={<Attempt />} />
         <Route
  path="/submissions/:submissionId/result"
  element={<Result />}
/>
<Route path="/attempts" element={<Attempts />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;


