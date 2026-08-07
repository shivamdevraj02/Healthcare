import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/auth/Landing.jsx";
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

