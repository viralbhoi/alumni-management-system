import { Link } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex gap-6">
                    <Link to="/">Dashboard</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/experience">Experience</Link>
                    <Link to="/education">Education</Link>
                    <Link to="/mentorship">Mentorship</Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-6">{children}</main>
        </div>
    );
}
