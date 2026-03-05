import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Discover() {
    const [me, setMe] = useState(null);
    const [alumni, setAlumni] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [selectedYear, setSelectedYear] = useState("ALL");

    const [filters, setFilters] = useState({
        name: "",
        industry: "",
        field: "",
        year_from: "",
        year_to: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        const identity = await api("/alumni/me");
        setMe(identity);

        // default search → user's batch
        const data = await api(
            `/alumni/search?year_from=${identity.graduation_year}&year_to=${identity.graduation_year}`,
        );

        setAlumni(data);
        setFiltered(data);

        setLoading(false);
    }

    async function fetchAlumni() {
        setLoading(true);

        const params = new URLSearchParams(filters).toString();

        const data = await api(`/alumni/search?${params}`);

        setAlumni(data);
        setFiltered(data);
        setSelectedYear("ALL");

        setLoading(false);
    }

    function handleChange(e) {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    }

    function handleYearFilter(year) {
        setSelectedYear(year);

        if (year === "ALL") {
            setFiltered(alumni);
            return;
        }

        const res = alumni.filter((a) => a.graduation_year === parseInt(year));

        setFiltered(res);
    }

    const years = [...new Set(alumni.map((a) => a.graduation_year))].sort(
        (a, b) => b - a,
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}

                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Discover Alumni
                    </h1>

                    <p className="text-gray-500">
                        Explore alumni across batches and industries
                    </p>
                </div>

                {/* Search Filters */}

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <Input
                            name="name"
                            placeholder="Search name"
                            value={filters.name}
                            onChange={handleChange}
                        />

                        <Input
                            name="industry"
                            placeholder="Industry"
                            value={filters.industry}
                            onChange={handleChange}
                        />

                        <Input
                            name="field"
                            placeholder="Field of Study"
                            value={filters.field}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Input
                            name="year_from"
                            placeholder="Year From"
                            value={filters.year_from}
                            onChange={handleChange}
                        />

                        <Input
                            name="year_to"
                            placeholder="Year To"
                            value={filters.year_to}
                            onChange={handleChange}
                        />

                        <button
                            onClick={fetchAlumni}
                            className="bg-gray-900 text-white rounded-xl px-4 py-2 hover:bg-black transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Year Filter */}

                {!loading && alumni.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            Filter by batch
                        </span>

                        <select
                            value={selectedYear}
                            onChange={(e) => handleYearFilter(e.target.value)}
                            className="border rounded-xl px-3 py-2 text-sm"
                        >
                            <option value="ALL">All Years</option>

                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Results */}

                {loading ? (
                    <p className="text-gray-500">Loading alumni...</p>
                ) : filtered.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-2xl text-gray-500 border">
                        No alumni found.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {filtered.map((a) => (
                            <AlumniCard key={a.id} alumni={a} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

function AlumniCard({ alumni }) {
    const initials = alumni.full_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <Link
            to={`/alumni/${alumni.id}`}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                    {initials}
                </div>

                <div>
                    <p className="font-semibold text-gray-900">
                        {alumni.full_name}
                    </p>

                    <p className="text-sm text-gray-500">
                        Class of {alumni.graduation_year}
                    </p>
                </div>
            </div>

            <p className="text-sm text-gray-600">
                {alumni.headline || "No headline"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
                {alumni.current_company}
            </p>
        </Link>
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
