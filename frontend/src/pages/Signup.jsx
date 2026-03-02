import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        roll_no: "",
        graduation_year: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api("/auth/register", {
                method: "POST",
                body: JSON.stringify(form),
            });

            setSuccess(
                "Registration successful. Your account will be verified by admin.",
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            setError("Registration failed. Please check details.");
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
                    Join the official alumni network and reconnect with your
                    academic legacy.
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">
                            Join Alumni Network
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Create your alumni account
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="full_name"
                            placeholder="Full Name"
                            required
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />

                        <input
                            name="roll_no"
                            placeholder="Roll Number"
                            required
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />

                        <input
                            name="graduation_year"
                            placeholder="Graduation Year"
                            type="number"
                            required
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />

                        <button
                            disabled={loading}
                            className={`w-full py-3 rounded-xl text-white transition ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
