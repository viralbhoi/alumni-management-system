import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Experience() {
    const [items, setItems] = useState([]);
    const [me, setMe] = useState(null);

    const [form, setForm] = useState({
        company: "",
        role_title: "",
        industry: "",
        start_year: "",
        end_year: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    async function load() {
        const [data, identity] = await Promise.all([
            api("/alumni/experience"),
            api("/alumni/me"),
        ]);
        setItems(data);
        setMe(identity);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function resetForm() {
        setForm({
            company: "",
            role_title: "",
            industry: "",
            start_year: "",
            end_year: "",
            description: "",
        });
        setEditingId(null);
        setShowForm(false);
    }

    async function handleSubmit() {
        try {
            if (editingId) {
                await api(`/alumni/experience/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(form),
                });
                setMessage("Experience updated successfully.");
            } else {
                await api("/alumni/experience", {
                    method: "POST",
                    body: JSON.stringify(form),
                });
                setMessage("Experience added successfully.");
            }

            resetForm();
            load();
        } catch {
            setMessage("Something went wrong.");
        }
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this experience?",
        );

        if (!confirmDelete) return;

        await api(`/alumni/experience/${id}`, {
            method: "DELETE",
        });

        setMessage("Experience deleted.");
        load();
    }

    function handleEdit(item) {
        setForm(item);
        setEditingId(item.id);
        setShowForm(true);
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Experience
                        </h1>
                        <p className="text-gray-500">
                            Your professional journey
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

                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition"
                            >
                                Add Experience
                            </button>
                        )}
                    </div>
                </div>

                {message && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm">
                        {message}
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="company"
                                placeholder="Company"
                                value={form.company}
                                onChange={handleChange}
                            />
                            <Input
                                name="role_title"
                                placeholder="Role"
                                value={form.role_title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <Input
                                name="industry"
                                placeholder="Industry"
                                value={form.industry}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                name="start_year"
                                placeholder="Start Year"
                                value={form.start_year}
                                onChange={handleChange}
                            />
                            <Input
                                type="number"
                                name="end_year"
                                placeholder="End Year (optional)"
                                value={form.end_year}
                                onChange={handleChange}
                            />
                        </div>

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-gray-900"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={resetForm}
                                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-black transition"
                            >
                                {editingId ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-6">
                        {items.map((exp) => (
                            <div
                                key={exp.id}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {exp.role_title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {exp.company} • {exp.industry}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {exp.start_year} -{" "}
                                            {exp.end_year || "Present"}
                                        </p>
                                        {exp.description && (
                                            <p className="text-gray-600 text-sm mt-2">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3 text-sm">
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="text-gray-600 hover:text-black"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

function Input(props) {
    return (
        <input
            {...props}
            className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
    );
}
