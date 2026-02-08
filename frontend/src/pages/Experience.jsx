import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

export default function Experience() {
    const [items, setItems] = useState([]);

    const [form, setForm] = useState({
        company: "",
        role_title: "",
        industry: "",
        start_year: "",
        end_year: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);

    async function load() {
        const data = await api("/alumni/experience");
        setItems(data);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function addExperience() {
        await api("/alumni/experience", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setForm({
            company: "",
            role_title: "",
            industry: "",
            start_year: "",
            end_year: "",
            description: "",
        });

        load();
    }

    async function remove(id) {
        await api(`/alumni/experience/${id}`, {
            method: "DELETE",
        });

        load();
    }

    return (
        <Layout>
            <div className="space-y-8">
                <h1 className="text-3xl font-semibold">Experience</h1>

                {/* Add Form */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                    <h2 className="font-medium text-lg">Add Experience</h2>

                    {/* Row 1 */}
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

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            name="industry"
                            placeholder="Industry"
                            value={form.industry}
                            onChange={handleChange}
                        />
                        <div /> {/* empty for spacing balance */}
                    </div>

                    {/* Row 3 (Start + End together) */}
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

                    {/* Description */}
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    />

                    {/* Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={addExperience}
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="space-y-4">
                        {items.map((exp) => (
                            <div
                                key={exp.id}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-start hover:shadow-md transition"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {exp.role_title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {exp.company} • {exp.industry}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {exp.start_year} -{" "}
                                        {exp.end_year || "Present"}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {exp.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => remove(exp.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Delete
                                </button>
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
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
        />
    );
}
