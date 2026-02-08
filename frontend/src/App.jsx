import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Mentorship from "./pages/Mentorship";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/education" element={<Education />} />
                <Route path="/mentorship" element={<Mentorship />} />
            </Routes>
        </BrowserRouter>
    );
}
