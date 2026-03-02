import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Search() {
    const [filters, setFilters] = useState({
        name: "",
        industry: "",
        graduation_year: "",
    });

    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 5;

    async function load() {
        const params = new URLSearchParams({
            ...filters,
            page,
            limit,
        });

        const data = await api(`/alumni/search?${params.toString()}`);
        setResults(data);
    }

    useEffect(() => {
        load();
    }, [page]);

    function handleChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    function handleSearch() {
        setPage(1);
        load();
    }

    return (
        <Layout>
            <div className="space-y-8">
                <h1 className="text-3xl font-semibold">Search Alumni</h1>

                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            name="name"
                            placeholder="Name"
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
                            name="graduation_year"
                            placeholder="Graduation Year"
                            value={filters.graduation_year}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4 ">
                    {results.length === 0 ? (
                        <p className="text-gray-500">No results found</p>
                    ) : (
                        results.map((alum) => (
                            <Link
                                to={`/alumni/${alum.id}`}
                                key={alum.id}
                                className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition block"
                            >
                                <h3 className="font-semibold">
                                    {alum.full_name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {alum.headline || "No headline"}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {alum.current_company || ""} •{" "}
                                    {alum.primary_industry || ""}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Class of {alum.graduation_year}
                                </p>
                            </Link>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center pt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 border rounded-xl disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600">Page {page}</span>

                    <button
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 border rounded-xl"
                    >
                        Next
                    </button>
                </div>
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
