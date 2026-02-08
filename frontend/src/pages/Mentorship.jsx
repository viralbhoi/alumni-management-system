import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

export default function Mentorship() {
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const [form, setForm] = useState({
        mentor_id: "",
        message: "",
    });

    async function load() {
        const inc = await api("/mentorship/requests/incoming");
        const out = await api("/mentorship/requests/outgoing");

        setIncoming(inc);
        setOutgoing(out);
    }

    useEffect(() => {
        load();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function sendRequest() {
        await api("/mentorship/requests", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setForm({ mentor_id: "", message: "" });
        load();
    }

    async function updateStatus(id, status) {
        await api(`/mentorship/requests/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });

        load();
    }

    return (
        <Layout>
            <div className="space-y-10">
                <h1 className="text-3xl font-semibold">Mentorship</h1>

                {/* Send Request */}
                <div className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
                    <h2 className="font-medium">Request Guidance</h2>

                    <Input
                        name="mentor_id"
                        placeholder="Mentor ID"
                        value={form.mentor_id}
                        onChange={handleChange}
                    />

                    <textarea
                        name="message"
                        placeholder="Message (optional)"
                        value={form.message}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                    />

                    <div className="flex justify-end">
                        <button
                            onClick={sendRequest}
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            Send Request
                        </button>
                    </div>
                </div>

                {/* Incoming */}
                <Section title="Incoming Requests">
                    {incoming.map((r) => (
                        <Card key={r.id}>
                            <div>
                                <p className="font-medium">
                                    {r.requester_name}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {r.message}
                                </p>
                            </div>

                            {r.status === "PENDING" ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            updateStatus(r.id, "ACCEPTED")
                                        }
                                        className="text-green-600"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateStatus(r.id, "REJECTED")
                                        }
                                        className="text-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500">
                                    {r.status}
                                </span>
                            )}
                        </Card>
                    ))}
                </Section>

                {/* Outgoing */}
                <Section title="Outgoing Requests">
                    {outgoing.map((r) => (
                        <Card key={r.id}>
                            <div>
                                <p className="font-medium">{r.mentor_name}</p>
                            </div>
                            <span className="text-sm text-gray-500">
                                {r.status}
                            </span>
                        </Card>
                    ))}
                </Section>
            </div>
        </Layout>
    );
}

/* Small reusable components */

function Input(props) {
    return (
        <input
            {...props}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
        />
    );
}

function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <h2 className="text-lg font-medium">{title}</h2>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function Card({ children }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border flex justify-between items-center">
            {children}
        </div>
    );
}
