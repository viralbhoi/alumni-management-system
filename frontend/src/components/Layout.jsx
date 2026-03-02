import { Link, useNavigate } from "react-router-dom";

function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload;
    } catch {
        return null;
    }
}

export default function Layout({ children }) {
    const navigate = useNavigate();
    const user = getUserFromToken();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* NAVBAR */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="font-semibold text-lg">
                            Alumni Portal
                        </Link>

                        {user?.role === "ALUMNI" && (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-600 hover:text-black"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/experience"
                                    className="text-gray-600 hover:text-black"
                                >
                                    Experience
                                </Link>
                                <Link
                                    to="/education"
                                    className="text-gray-600 hover:text-black"
                                >
                                    Education
                                </Link>
                                <Link
                                    to="/mentorship"
                                    className="text-gray-600 hover:text-black"
                                >
                                    Mentorship
                                </Link>
                                <Link
                                    to="/discover"
                                    className="text-gray-600 hover:text-black"
                                >
                                    Discover
                                </Link>
                            </>
                        )}

                        {user?.role === "ADMIN" && (
                            <>
                                <Link
                                    to="/admin"
                                    className="text-gray-600 hover:text-black"
                                >
                                    Admin Panel
                                </Link>
                                <Link
                                    to="/discover"
                                    className="text-gray-600 hover:text-black"
                                >
                                    Discover
                                </Link>
                            </>
                        )}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-6">
                        {user && (
                            <span className="text-sm text-gray-500">
                                {user.role}
                            </span>
                        )}

                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-500 hover:text-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-6">
                {children}
            </main>
        </div>
    );
}
