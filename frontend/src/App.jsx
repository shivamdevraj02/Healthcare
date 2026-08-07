import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/auth/Landing.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}