import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/auth/Landing.jsx";
import Login from "./pages/auth/Loing.jsx";
import Register from "./pages/auth/Register.jsx"

// import Login from "./pages/auth/Login.jsx"; // Fixed the typo here
// import Register from "./pages/auth/Register.jsx"; // Added the missing import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Added the missing route */}
      </Routes>
    </BrowserRouter>
  );
}