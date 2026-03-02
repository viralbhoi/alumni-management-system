import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [announcements, setAnnouncements] = useState([]);
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [me, setMe] = useState(null);

    const [stats, setStats] = useState({
        exp: 0,
        edu: 0,
        incoming: 0,
        outgoing: 0,
    });

    useEffect(() => {
        async function load() {
            try {
                const [profile, exp, edu, incoming, outgoing, notices] =
                    await Promise.all([
                        api("/alumni/me"),
                        api("/alumni/experience"),
                        api("/alumni/education"),
                        api("/mentorship/requests/incoming"),
                        api("/mentorship/requests/outgoing"),
                        api("/announcements"),
                    ]);

                setMe(profile);
                setExperience(exp);
                setEducation(edu);
                setIncoming(incoming);
                setOutgoing(outgoing);
                setAnnouncements(notices);

                setStats({
                    exp: exp.length,
                    edu: edu.length,
                    incoming: incoming.length,
                    outgoing: outgoing.length,
                });
            } catch (err) {
                console.error("Dashboard load failed", err);
            }
        }

        load();
    }, []);

    return (
        <Layout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Welcome back
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage your alumni profile and stay connected.
                        </p>
                    </div>

                    {me && (
                        <Link
                            to={`/alumni/${me.id}`}
                            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition shadow-sm"
                        >
                            View Public Profile
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <StatCard label="Experiences" value={stats.exp} />
                            <StatCard label="Education" value={stats.edu} />
                            <StatCard label="Incoming" value={stats.incoming} />
                            <StatCard label="Outgoing" value={stats.outgoing} />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Quick Access
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <QuickCard
                                    to="/profile"
                                    title="Edit Profile"
                                    desc="Update your personal and professional details."
                                />
                                <QuickCard
                                    to="/experience"
                                    title="Manage Experience"
                                    desc="Add or update your work history."
                                />
                                <QuickCard
                                    to="/education"
                                    title="Manage Education"
                                    desc="Maintain your academic background."
                                />
                                <QuickCard
                                    to="/mentorship"
                                    title="Mentorship"
                                    desc="Review and manage mentorship requests."
                                />
                                <QuickCard
                                    to="/discover"
                                    title="Discover Alumni"
                                    desc="Explore alumni by year or industry."
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE — Announcements */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Announcements
                        </h2>

                        {announcements.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No announcements available.
                            </p>
                        ) : (
                            <div className="space-y-5 max-h-125 overflow-y-auto pr-2">
                                {announcements.map((a) => (
                                    <div
                                        key={a.id}
                                        className="border-b pb-4 last:border-none"
                                    >
                                        <p className="font-medium text-gray-900">
                                            {a.title}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {a.content}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(
                                                a.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

/* Components */

function StatCard({ label, value }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{value}</p>
        </div>
    );
}

function QuickCard({ to, title, desc }) {
    return (
        <Link
            to={to}
            className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition"
        >
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-2">{desc}</p>
        </Link>
    );
}
