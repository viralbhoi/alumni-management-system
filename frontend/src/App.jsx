import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Mentorship from "./pages/Mentorship";
import Search from "./pages/Search";
import PublicProfile from "./pages/PublicProfile";
import Admin from "./pages/Admin";
import Discover from "./pages/Discover";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/alumni/:id" element={<PublicProfile />} />
                <Route path="/signup" element={<Signup />} />
                {/* PROTECTED ROUTES */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/experience"
                    element={
                        <ProtectedRoute>
                            <Experience />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/education"
                    element={
                        <ProtectedRoute>
                            <Education />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentorship"
                    element={
                        <ProtectedRoute>
                            <Mentorship />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/discover"
                    element={
                        <ProtectedRoute>
                            <Discover />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
