import { useState } from "react";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import API from "../utils/api";

// ─── Validation Rules ─────────────────────────────────────────────────────────
const VALIDATORS = {
  name: (v) => (!v.trim() ? "Full name is required." : ""),
  email: (v) => {
    if (!v.trim()) return "Email is required.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address.";
  },
  phone: (v) => {
    if (!v.trim()) return ""; // optional
    return /^\+?[\d\s\-().]{7,15}$/.test(v) ? "" : "Enter a valid phone number (7–15 digits).";
  },
  linkedin: (v) => {
    if (!v.trim()) return ""; // optional
    return /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/.test(v)
      ? ""
      : "Must be a valid LinkedIn URL (linkedin.com/...).";
  },
  github: (v) => {
    if (!v.trim()) return ""; // optional
    return /^(https?:\/\/)?(www\.)?github\.com\/.+/.test(v)
      ? ""
      : "Must be a valid GitHub URL (github.com/...).";
  },
  leetcode: (v) => {
    if (!v.trim()) return ""; // optional
    return /^(https?:\/\/)?(www\.)?leetcode\.com\/.+/.test(v)
      ? ""
      : "Must be a valid LeetCode URL (leetcode.com/...).";
  },
};

export default function ResumeBuilder() {

  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    linkedin: "",
    github: "",
    leetcode: "",
    summary: "",
    education: "",
    skills: "",
    experience: "",
    projects: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");

  const validate = (name, value) => {
    if (VALIDATORS[name]) {
      return VALIDATORS[name](value);
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
    // Live-validate once a field has been touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const runAllValidations = () => {
    const newErrors = {};
    Object.keys(VALIDATORS).forEach((field) => {
      const err = validate(field, resume[field] || "");
      if (err) newErrors[field] = err;
    });
    // Mark all validated fields as touched
    setTouched((prev) => {
      const t = { ...prev };
      Object.keys(VALIDATORS).forEach((f) => (t[f] = true));
      return t;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!runAllValidations()) {
      toast.error("Please fix the errors before generating.");
      return;
    }
    setLoading(true);
    setGeneratedMarkdown("");

    try {
      const formData = new FormData();
      Object.keys(resume).forEach((key) => {
        if (resume[key]) formData.append(key, resume[key]);
      });

      const res = await API.post("/resume/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      if (data.success) {
        setGeneratedMarkdown(data.data.generatedResume);
        toast.success("Resume generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate resume");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedMarkdown) return;
    setPdfLoading(true);
    let toastId;
    try {
      toastId = toast.loading("Generating PDF...");
      const res = await API.post(
        "/resume/pdf",
        { markdown: generatedMarkdown },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.name ? resume.name.replace(/\s+/g, "_") : "resume"}_generated.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Error downloading PDF", { id: toastId });
    } finally {
      setPdfLoading(false);
    }
  };

  const fieldProps = (name) => ({
    name,
    value: resume[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto flex flex-col gap-10 px-4 md:px-8">

        <div>
          <h1 className="text-4xl font-bold">AI Resume Builder</h1>
          <p className="text-gray-400 mt-2">
            Create a professional resume using AI assistance and download it as PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col gap-5"
          >
            {/* ── Required Fields ── */}
            <SectionHeading>Personal Details</SectionHeading>

            <Input label="Full Name *" {...fieldProps("name")} />
            <Input label="Email *" type="email" {...fieldProps("email")} />
            <Input label="Phone Number" type="tel" placeholder="+91 9876543210" {...fieldProps("phone")} />
            <Input label="Location" placeholder="City, Country" {...fieldProps("location")} />

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Gender (Optional)</label>
              <select
                name="gender"
                onChange={handleChange}
                value={resume.gender}
                className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
              >
                <option value="" className="bg-gray-900">Select Gender</option>
                <option value="Male" className="bg-gray-900">Male</option>
                <option value="Female" className="bg-gray-900">Female</option>
                <option value="Other" className="bg-gray-900">Other</option>
              </select>
            </div>

            {/* ── Social Links ── */}
            <SectionHeading>Social Links (Optional)</SectionHeading>

            <Input label="LinkedIn" placeholder="https://linkedin.com/in/yourname" {...fieldProps("linkedin")} />
            <Input label="GitHub" placeholder="https://github.com/yourusername" {...fieldProps("github")} />
            <Input label="LeetCode" placeholder="https://leetcode.com/yourusername" {...fieldProps("leetcode")} />

            {/* ── Resume Content ── */}
            <SectionHeading>Resume Content</SectionHeading>

            <Textarea label="Summary (2–3 lines)" placeholder="A brief professional intro about yourself..." {...fieldProps("summary")} />
            <Textarea label="Experience" placeholder="Company Name | Role | Duration&#10;- Key achievement or responsibility..." {...fieldProps("experience")} />
            <Textarea label="Education" placeholder="Degree, Institution, Year, CGPA..." {...fieldProps("education")} />
            <Textarea label="Skills" placeholder="Languages: Python, JS&#10;Frameworks: React, Node..." {...fieldProps("skills")} />
            <Textarea label="Projects" placeholder="Project Name – Tech Stack&#10;- Description and features..." {...fieldProps("projects")} />

            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}`}
            >
              {loading ? "Generating..." : "Generate Resume"}
            </button>
          </form>

          {/* Preview & Download */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Resume Preview</h2>
            {generatedMarkdown ? (
              <>
                <div className="flex-1 bg-black/40 rounded-lg p-6 overflow-y-auto max-h-[700px] border border-white/5 text-sm whitespace-pre-wrap font-mono text-gray-300">
                  {generatedMarkdown}
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  type="button"
                  className={`bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-lg font-semibold transition flex justify-center items-center gap-2 mt-auto ${pdfLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                >
                  {pdfLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  )}
                  {pdfLoading ? "Generating PDF..." : "Download as PDF"}
                </button>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p>Fill out the form and generate</p>
                <p>to see your resume preview here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ── Section Heading ─────────────────────────────────────────────────────────── */
function SectionHeading({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 border-b border-white/10 pb-1 mt-2">
      {children}
    </p>
  );
}

/* ── Input Component ─────────────────────────────────────────────────────────── */
function Input({ label, name, value, onChange, onBlur, error, type = "text", placeholder = "" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`p-3 rounded-lg bg-white/5 border focus:ring-2 focus:outline-none transition ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
            : "border-white/10 focus:border-purple-500 focus:ring-purple-500/40"
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

/* ── Textarea Component ──────────────────────────────────────────────────────── */
function Textarea({ label, name, value, onChange, onBlur, error, placeholder = "" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <textarea
        name={name}
        value={value}
        rows="3"
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`p-3 rounded-lg bg-white/5 border focus:ring-2 focus:outline-none transition ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
            : "border-white/10 focus:border-purple-500 focus:ring-purple-500/40"
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
