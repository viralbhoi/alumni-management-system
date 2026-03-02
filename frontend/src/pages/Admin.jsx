import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Admin() {
    const [pending, setPending] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [form, setForm] = useState({
        title: "",
        content: "",
        is_pinned: false,
    });

    const load = async () => {
        const pendingData = await api("/admin/pending");
        const announcementData = await api("/announcements");

        setPending(pendingData);
        setAnnouncements(announcementData);
    };

    useEffect(() => {
        load();
    }, []);

    const approve = async (id) => {
        await api(`/admin/verify/${id}`, { method: "PATCH" });
        load();
    };

    const createAnnouncement = async (e) => {
        e.preventDefault();

        await api("/announcements", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setForm({ title: "", content: "", is_pinned: false });
        load();
    };

    return (
        <div className="p-8 space-y-10">
            <h1 className="text-2xl font-semibold">Admin Panel</h1>

            {/* Pending Approvals */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                <h2 className="text-lg font-medium">Pending Alumni</h2>

                {pending.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        No pending approvals.
                    </p>
                )}

                {pending.map((user) => (
                    <div
                        key={user.id}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>

                        <button
                            onClick={() => approve(user.id)}
                            className="bg-green-600 text-white px-4 py-1 rounded-xl text-sm"
                        >
                            Approve
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Announcement */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                <h2 className="text-lg font-medium">Create Announcement</h2>

                <form onSubmit={createAnnouncement} className="space-y-3">
                    <input
                        placeholder="Title"
                        className="w-full border rounded-xl p-3"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Content"
                        className="w-full border rounded-xl p-3"
                        rows="4"
                        value={form.content}
                        onChange={(e) =>
                            setForm({ ...form, content: e.target.value })
                        }
                    />

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={form.is_pinned}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    is_pinned: e.target.checked,
                                })
                            }
                        />
                        Pin Announcement
                    </label>

                    <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
                        Publish
                    </button>
                </form>
            </div>
        </div>
    );
}
