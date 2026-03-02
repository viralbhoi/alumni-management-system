import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Profile() {
    const [form, setForm] = useState({
        headline: "",
        current_company: "",
        role_title: "",
        primary_industry: "",
        location: "",
        bio: "",
    });

    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const [profile, identity] = await Promise.all([
                    api("/alumni/profile"),
                    api("/alumni/me"),
                ]);

                setForm(profile || {});
                setMe(identity);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setSaving(true);
        setMessage("");
        try {
            await api("/alumni/profile", {
                method: "PUT",
                body: JSON.stringify(form),
            });

            setEditing(false);
            setMessage("Profile updated successfully.");
        } catch (err) {
            setMessage("Error updating profile.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Profile
                        </h1>
                        <p className="text-gray-500">
                            Your professional alumni identity
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {me && (
                            <Link
                                to={`/alumni/${me.id}`}
                                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                            >
                                View Public Profile
                            </Link>
                        )}

                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {message && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm">
                        {message}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500">Loading profile...</p>
                ) : (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        {!editing ? (
                            <ProfileView form={form} />
                        ) : (
                            <ProfileEdit
                                form={form}
                                handleChange={handleChange}
                                handleSave={handleSave}
                                saving={saving}
                                onCancel={() => setEditing(false)}
                            />
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}

/* VIEW MODE */

function ProfileView({ form }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    {form.headline || "No headline added"}
                </h2>
                <p className="text-gray-600 mt-1">
                    {form.role_title}{" "}
                    {form.current_company && `at ${form.current_company}`}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
                <Info label="Industry" value={form.primary_industry} />
                <Info label="Location" value={form.location} />
            </div>

            <div>
                <p className="text-gray-500 text-sm mb-2">About</p>
                <p className="text-gray-700 whitespace-pre-line">
                    {form.bio || "No bio added."}
                </p>
            </div>
        </div>
    );
}

/* EDIT MODE */

function ProfileEdit({ form, handleChange, handleSave, saving, onCancel }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Headline"
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                />
                <Input
                    label="Company"
                    name="current_company"
                    value={form.current_company}
                    onChange={handleChange}
                />
                <Input
                    label="Role"
                    name="role_title"
                    value={form.role_title}
                    onChange={handleChange}
                />
                <Input
                    label="Industry"
                    name="primary_industry"
                    value={form.primary_industry}
                    onChange={handleChange}
                />
            </div>

            <Input
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
            />

            <div>
                <label className="text-sm text-gray-600">Bio</label>
                <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3 mt-1 h-28 focus:ring-2 focus:ring-gray-900"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-black transition"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">{label}</label>
            <input
                {...props}
                className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="text-gray-900 font-medium">{value || "—"}</p>
        </div>
    );
}
