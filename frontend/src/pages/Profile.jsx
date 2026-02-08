import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

export default function Profile() {
    const [form, setForm] = useState({
        headline: "",
        current_company: "",
        role_title: "",
        primary_industry: "",
        location: "",
        bio: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await api("/alumni/profile");
                setForm({ ...form, ...data });
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
        try {
            await api("/alumni/profile", {
                method: "PUT",
                body: JSON.stringify(form),
            });
            alert("Saved successfully");
        } catch (err) {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Profile
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Update your professional information
                    </p>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 space-y-6 transition-all duration-200">
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
                                className="w-full border rounded-xl p-3 mt-1 h-28 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-700 transition-all duration-150"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">{label}</label>
            <input
                {...props}
                className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}
