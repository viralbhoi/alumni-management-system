import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await api("/auth/login", {
                method: "POST",
                body: JSON.stringify(form),
            });

            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT PANEL */}
            <div className="hidden md:flex md:w-1/2 bg-blue-700 text-white flex-col justify-center items-center p-10 text-center space-y-6">
                <img
                    src="/logo.png"
                    alt="Institute Logo"
                    className="h-48 w-auto"
                />

                <h1 className="text-5xl font-bold leading-tight">
                    C.V.M. Higher Secondary Education Complex
                </h1>

                <p className="opacity-90 max-w-md text-md leading-relaxed">
                    Science Stream • Established June 1976 • Vallabh Vidyanagar
                </p>

                <p className="opacity-80 text-md max-w-md">
                    Connecting generations of alumni through mentorship,
                    collaboration, and institutional legacy.
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">Alumni Login</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Access your alumni dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className={`w-full py-3 rounded-xl text-white transition ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
