import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import API from "../utils/api";

export default function Dashboard() {
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [history, setHistory] = useState([]);
    const [resumeCount, setResumeCount] = useState(0);
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await API.get('/profile/me');
                const data = res.data.data;

                let filledCount = 0;
                const totalFields = 20;

                if (data.firstName) filledCount++;
                if (data.lastName) filledCount++;
                if (data.role) filledCount++;
                if (data.university) filledCount++;
                if (data.degree) filledCount++;
                if (data.cgpa) filledCount++;
                if (data.graduationYear) filledCount++;
                if (data.company) filledCount++;
                if (data.position) filledCount++;
                if (data.experienceYears) filledCount++;
                if (data.github) filledCount++;
                if (data.linkedin) filledCount++;
                if (data.portfolio) filledCount++;
                if (data.skills && data.skills.length > 0) filledCount++;
                if (data.languages && data.languages.length > 0) filledCount++;
                if (data.profile?.gender) filledCount++;
                if (data.profile?.dob) filledCount++;
                if (data.profile?.phone) filledCount++;
                if (data.profile?.address) filledCount++;
                if (data.profile?.bio) filledCount++;

                const percentage = Math.round((filledCount / totalFields) * 100);
                setCompletionPercentage(percentage);
            } catch (err) {
                console.error("Failed to fetch profile for completion stats", err);
            }
        };

        fetchProfileData();
    }, []);
    
    const fetchHistory = async () => {
        try {
            const res = await API.get("/tools/history");
            const data = res.data;
            if (data.success) setHistory(data.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };
    useEffect(() => {
        fetchHistory();

        const fetchResumeCount = async () => {
            try {
                const res = await API.get("/resume/user");
                const data = res.data;
                if (data.success) setResumeCount(data.data.length);
            } catch (err) {
                console.error("Failed to fetch resume count", err);
            }
        };
        fetchResumeCount();
    }, []);
    return (
        <Layout>

            <div className="flex flex-col gap-10">

                {/* WELCOME SECTION */}

                <div>
                    <h1 className="text-4xl font-bold">
                        Welcome back 👋
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Ready to build something with AI today?
                    </p>
                </div>

                {/* STATS */}

                <div className="grid md:grid-cols-3 gap-6">

                    <StatCard title="AI Requests" value={history.length} icon="⚡" color="blue" />

                    <StatCard
                        title="Tools Used"
                        value={[...new Set(history.map(h => h.toolName))].length}
                        icon="🧰"
                        color="purple"
                    />

                    <StatCard
                        title="Resumes Generated"
                        value={history.filter(h => h.toolName === "resume-builder").length}
                        icon="📄"
                        color="emerald"
                    />

                </div>

                {/* AI TOOLS */}

                <div>

                    <h2 className="text-2xl font-semibold mb-6">
                        AI Tools
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        <ToolCard
                            title="Code Explainer"
                            desc="Understand any code instantly"
                            icon="⚡"
                            link="/tools/code-explainer"
                        />

                        <ToolCard
                            title="SQL Generator"
                            desc="Convert text to SQL queries"
                            icon="🧠"
                            link="/tools/sql-generator"
                        />

                        <ToolCard
                            title="Regex Generator"
                            desc="Generate regex patterns"
                            icon="🔍"
                            link="/tools/regex-generator"
                        />

                        <ToolCard
                            title="Resume Builder"
                            desc="Create AI powered resumes"
                            icon="📄"
                            link="/resume-builder"
                        />

                        <ToolCard
                            title="Code Reviewer"
                            desc="Find bugs and improvements"
                            icon="🛠"
                            link="/tools/code-reviewer"
                        />

                        <ToolCard
                            title="Interview Prep"
                            desc="Generate interview questions"
                            icon="🎯"
                            link="/tools/interview"
                        />

                    </div>

                </div>

                {/* RECENT ACTIVITY */}

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Recent Activity
                    </h2>

                    <ul className="text-gray-300 flex flex-col gap-3 text-sm">

                        {history.length === 0 ? (
                            <p className="text-gray-500">No activity yet</p>
                        ) : (
                            history.slice(0, 5).map((item) => (
                                <li
                                    key={item._id}
                                    className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg"
                                >
                                    <span className="capitalize">
                                        {item.toolName.replace("-", " ")}
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </li>
                            ))
                        )}

                    </ul>

                </div>

                {/* PROFILE COMPLETION */}

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Profile Completion
                    </h2>

                    <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                        {completionPercentage}% completed
                    </p>

                </div>

            </div>

        </Layout>
    );
}


/* TOOL CARD */

function ToolCard({ title, desc, icon, link }) {
    return (
        <Link href={link}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition cursor-pointer h-full">

                <div className="text-3xl mb-3">
                    {icon}
                </div>

                <h3 className="text-lg font-semibold">
                    {title}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                    {desc}
                </p>

            </div>
        </Link>
    );
}


/* STAT CARD */

function StatCard({ title, value, icon, color = "blue" }) {
    const colorMap = {
        blue:    "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
        purple:  "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
        emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    };
    const accent = colorMap[color] || colorMap.blue;
    return (
        <div className={`bg-gradient-to-br ${accent} backdrop-blur-xl border rounded-xl p-6 flex flex-col gap-2`}>
            {icon && <span className="text-2xl">{icon}</span>}
            <p className="text-gray-400 text-sm">{title}</p>
            <h2 className="text-3xl font-bold mt-1">{value ?? "—"}</h2>
        </div>
    );
}