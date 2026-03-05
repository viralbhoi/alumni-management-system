import { useEffect, useState } from "react";
import { api } from "../api/client";
import Layout from "../components/Layout";

export default function Admin() {
    const [pending, setPending] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    const [form, setForm] = useState({
        title: "",
        content: "",
        is_pinned: false,
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);

        const pendingData = await api("/admin/pending");
        const announcementData = await api("/announcements?page=1&limit=20");

        setPending(pendingData);
        setAnnouncements(announcementData);

        setLoading(false);
    }

    async function approve(id) {
        await api(`/admin/verify/${id}`, { method: "PATCH" });
        load();
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    function editAnnouncement(a) {
        setForm({
            title: a.title,
            content: a.content,
            is_pinned: a.is_pinned,
        });

        setEditingId(a.id);
    }

    async function deleteAnnouncement(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this announcement?",
        );

        if (!confirmDelete) return;

        await api(`/announcements/${id}`, {
            method: "DELETE",
        });

        load();
    }

    async function createAnnouncement(e) {
        e.preventDefault();

        setSaving(true);

        if (editingId) {
            await api(`/announcements/${editingId}`, {
                method: "PATCH",
                body: JSON.stringify(form),
            });
        } else {
            await api("/announcements", {
                method: "POST",
                body: JSON.stringify(form),
            });
        }

        setForm({
            title: "",
            content: "",
            is_pinned: false,
        });

        setEditingId(null);
        setSaving(false);

        load();
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}

                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Admin Panel
                    </h1>

                    <p className="text-gray-500 text-sm">
                        Manage alumni approvals and announcements
                    </p>
                </div>

                {/* Pending Alumni */}

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Pending Alumni Approvals
                    </h2>

                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : pending.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            No pending approvals.
                        </p>
                    ) : (
                        pending.map((user) => (
                            <div
                                key={user.id}
                                className="flex justify-between items-center border-b last:border-none pb-3"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {user.full_name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>

                                <button
                                    onClick={() => approve(user.id)}
                                    className="bg-green-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-green-700 transition"
                                >
                                    Approve
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Create / Edit Announcement */}

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {editingId
                            ? "Edit Announcement"
                            : "Create Announcement"}
                    </h2>

                    <form onSubmit={createAnnouncement} className="space-y-4">
                        <input
                            name="title"
                            placeholder="Announcement Title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />

                        <textarea
                            name="content"
                            placeholder="Announcement Content"
                            rows="4"
                            value={form.content}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />

                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="is_pinned"
                                checked={form.is_pinned}
                                onChange={handleChange}
                            />
                            Pin Announcement
                        </label>

                        <div className="flex justify-end gap-3">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm({
                                            title: "",
                                            content: "",
                                            is_pinned: false,
                                        });
                                    }}
                                    className="px-4 py-2 border rounded-xl text-sm"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                disabled={saving}
                                className="bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-black transition"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                      ? "Update Announcement"
                                      : "Publish Announcement"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing Announcements */}

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Existing Announcements
                    </h2>

                    {announcements.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            No announcements available.
                        </p>
                    ) : (
                        announcements.map((a) => (
                            <div
                                key={a.id}
                                className="border-b last:border-none pb-4 flex justify-between items-start"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        {a.is_pinned && (
                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                                Pinned
                                            </span>
                                        )}

                                        <p className="font-medium text-gray-900">
                                            {a.title}
                                        </p>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {a.content}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(
                                            a.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex gap-4 text-sm">
                                    <button
                                        onClick={() => editAnnouncement(a)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteAnnouncement(a.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}
