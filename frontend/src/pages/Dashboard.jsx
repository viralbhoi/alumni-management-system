import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({
        exp: 0,
        edu: 0,
        incoming: 0,
        outgoing: 0,
    });

    useEffect(() => {
        async function load() {
            const [exp, edu, inc, out] = await Promise.all([
                api("/alumni/experience"),
                api("/alumni/education"),
                api("/mentorship/requests/incoming"),
                api("/mentorship/requests/outgoing"),
            ]);

            setStats({
                exp: exp.length,
                edu: edu.length,
                incoming: inc.length,
                outgoing: out.length,
            });
        }

        load();
    }, []);

    return (
        <Layout>
            <div className="space-y-10">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-semibold">Dashboard</h1>
                    <p className="text-gray-500">
                        Welcome back. Manage your alumni profile and
                        connections.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Experiences" value={stats.exp} />
                    <StatCard label="Education" value={stats.edu} />
                    <StatCard
                        label="Incoming Requests"
                        value={stats.incoming}
                    />
                    <StatCard
                        label="Outgoing Requests"
                        value={stats.outgoing}
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
                    <h2 className="font-medium">Quick Actions</h2>

                    <div className="flex flex-wrap gap-3">
                        <NavButton to="/profile">Edit Profile</NavButton>
                        <NavButton to="/experience">Add Experience</NavButton>
                        <NavButton to="/education">Add Education</NavButton>
                        <NavButton to="/mentorship">Mentorship</NavButton>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

/* Components */

function StatCard({ label, value }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
    );
}

function NavButton({ to, children }) {
    return (
        <Link
            to={to}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
            {children}
        </Link>
    );
}
