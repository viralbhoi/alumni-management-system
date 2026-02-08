import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

export default function Education() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        degree_type: "",
        field_of_study: "",
        institution: "",
        start_year: "",
        end_year: "",
        description: "",
    });

    async function load() {
        const data = await api("/alumni/education");
        setItems(data);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function addEducation() {
        await api("/alumni/education", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setForm({
            degree_type: "",
            field_of_study: "",
            institution: "",
            start_year: "",
            end_year: "",
            description: "",
        });

        load();
    }

    async function remove(id) {
        await api(`/alumni/education/${id}`, {
            method: "DELETE",
        });

        load();
    }

    return (
        <Layout>
            <div className="space-y-8">
                <h1 className="text-3xl font-semibold">Education</h1>

                {/* Add Form */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                    <h2 className="font-medium text-lg">Add Education</h2>

                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            name="degree_type"
                            placeholder="Degree (BTech, MSc, etc.)"
                            value={form.degree_type}
                            onChange={handleChange}
                        />

                        <Input
                            name="field_of_study"
                            placeholder="Field of Study"
                            value={form.field_of_study}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Row 2 */}
                    <Input
                        name="institution"
                        placeholder="Institution"
                        value={form.institution}
                        onChange={handleChange}
                    />

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
                            placeholder="End Year"
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
                            onClick={addEducation}
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
                        {items.map((edu) => (
                            <div
                                key={edu.id}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex justify-between hover:shadow-md transition"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {edu.degree_type}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {edu.field_of_study}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {edu.institution}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {edu.start_year} -{" "}
                                        {edu.end_year || "Present"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => remove(edu.id)}
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
