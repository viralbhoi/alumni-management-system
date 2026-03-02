import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api/client";

export default function PublicProfile() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);

    useEffect(() => {
        async function load() {
            const [p, exp, edu] = await Promise.all([
                api(`/public/${id}`),
                api(`/public/${id}/experience`),
                api(`/public/${id}/education`),
            ]);

            setProfile(p);
            setExperience(exp);
            setEducation(edu);
        }

        load();
    }, [id]);

    if (!profile) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto py-20 text-center text-gray-500">
                    Loading profile...
                </div>
            </Layout>
        );
    }

    const initials = profile.full_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-12">
                {/* HERO SECTION */}
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-semibold">
                            {initials}
                        </div>

                        <div className="pl-10">
                            <h1 className="text-3xl font-semibold text-gray-900">
                                {profile.full_name}
                            </h1>

                            {profile.headline && (
                                <p className="text-gray-600 mt-1">
                                    {profile.headline}
                                </p>
                            )}

                            <p className="text-sm text-gray-500 mt-2">
                                {profile.current_company} •{" "}
                                {profile.primary_industry}
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                                Class of {profile.graduation_year}
                            </p>
                        </div>
                    </div>

                    {profile.bio && (
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {profile.bio}
                            </p>
                        </div>
                    )}
                </div>

                {/* EXPERIENCE */}
                <Section title="Experience">
                    {experience.length === 0 ? (
                        <EmptyState text="No experience added yet." />
                    ) : (
                        experience.map((e) => (
                            <Card key={e.id}>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {e.role_title}
                                </h3>

                                <p className="text-gray-600 text-sm mt-1">
                                    {e.company} • {e.industry}
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                    {e.start_year} - {e.end_year || "Present"}
                                </p>

                                {e.description && (
                                    <p className="text-gray-600 text-sm mt-3">
                                        {e.description}
                                    </p>
                                )}
                            </Card>
                        ))
                    )}
                </Section>

                {/* EDUCATION */}
                <Section title="Education">
                    {education.length === 0 ? (
                        <EmptyState text="No education details added yet." />
                    ) : (
                        education.map((e) => (
                            <Card key={e.id}>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {e.degree_type}
                                </h3>

                                <p className="text-gray-600 text-sm mt-1">
                                    {e.field_of_study}
                                </p>

                                <p className="text-gray-600 text-sm mt-1">
                                    {e.institution}
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                    {e.start_year} - {e.end_year || "Present"}
                                </p>

                                {e.description && (
                                    <p className="text-gray-600 text-sm mt-3">
                                        {e.description}
                                    </p>
                                )}
                            </Card>
                        ))
                    )}
                </Section>
            </div>
        </Layout>
    );
}

/* Reusable Components */

function Section({ title, children }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function Card({ children }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
            {children}
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="bg-gray-50 p-6 rounded-2xl text-sm text-gray-500 border border-gray-100">
            {text}
        </div>
    );
}
