import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-hot-toast";
import API from "../utils/api";

export default function Signup() {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreed, setAgreed] = useState(false);

    // New states for validation and visibility
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateField = (name, value, currentForm) => {
        let errorMsg = "";
        switch (name) {
            case "firstName":
                if (!value.trim()) errorMsg = "First name is required";
                break;
            case "lastName":
                if (!value.trim()) errorMsg = "Last name is required";
                break;
            case "email":
                if (!value.trim()) errorMsg = "Email is required";
                else if (!/^[^\s@]+@gmail\.com$/.test(value)) errorMsg = "Only @gmail.com emails are allowed";
                break;
            case "password":
                if (!value) errorMsg = "Password is required";
                else if (value.length < 6) errorMsg = "Password must be at least 6 characters";
                else if (!/[A-Z]/.test(value)) errorMsg = "Password requires an uppercase letter";
                else if (!/[0-9]/.test(value)) errorMsg = "Password requires a number";
                else if (!/[^A-Za-z0-9]/.test(value)) errorMsg = "Password requires a special character";

                if (currentForm.confirmPassword && value !== currentForm.confirmPassword) {
                    setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
                } else if (currentForm.confirmPassword) {
                    setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                }
                break;
            case "confirmPassword":
                if (!value) errorMsg = "Please confirm your password";
                else if (value !== currentForm.password) errorMsg = "Passwords do not match";
                break;
            case "role":
                if (!value) errorMsg = "Role is required";
                break;
            default:
                break;
        }
        return errorMsg;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newForm = { ...form, [name]: value };
        setForm(newForm);
        const errorMsg = validateField(name, value, newForm);
        setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
    };
    const handleGoogle = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    };

    const handleGithub = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github`;
    };
    // Check form validity overall
    const isFormValid =
        form.firstName.trim() !== "" &&
        form.lastName.trim() !== "" &&
        form.email.trim() !== "" &&
        /^[^\s@]+@gmail\.com$/.test(form.email) &&
        form.role !== "" &&
        form.password.length >= 6 &&
        /[A-Z]/.test(form.password) &&
        /[0-9]/.test(form.password) &&
        /[^A-Za-z0-9]/.test(form.password) &&
        form.password === form.confirmPassword &&
        agreed;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!agreed) {
            toast.error("Please accept Terms & Privacy Policy");
            return setError("Please accept Terms & Privacy Policy");
        }

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);

            const res = await API.post("/auth/signup", {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
                role: form.role,
            });

            // store token (if returned)
            if (res.data.data.token) {
                localStorage.setItem("token", res.data.data.token);
            }

            toast.success("Account created successfully!");
            router.push("/dashboard");

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white py-12 px-4 sm:px-6 lg:px-8 relative">

            {/* Floating Home Button */}
            <Link href="/" className="absolute top-6 left-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all text-gray-400 hover:text-white group z-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </Link>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-lg shadow-2xl relative z-10">

                <h2 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Create an Account
                </h2>
                <p className="text-gray-400 text-center mb-8 text-sm">Join CodePilot & supercharge your workflow.</p>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm text-gray-300 font-medium">First Name</label>
                            <input
                                name="firstName"
                                placeholder="John"
                                onChange={handleChange}
                                onBlur={(e) => {
                                    const errorMsg = validateField(e.target.name, e.target.value, form);
                                    setFieldErrors(prev => ({ ...prev, [e.target.name]: errorMsg }));
                                }}
                                className={`p-3 rounded-lg bg-white/5 border ${fieldErrors.firstName ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500 focus:bg-white/10 focus:outline-none transition text-sm`}
                            />
                            {fieldErrors.firstName && <span className="text-xs text-red-400/80 mt-0.5">{fieldErrors.firstName}</span>}
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm text-gray-300 font-medium">Last Name</label>
                            <input
                                name="lastName"
                                placeholder="Doe"
                                onChange={handleChange}
                                onBlur={(e) => {
                                    const errorMsg = validateField(e.target.name, e.target.value, form);
                                    setFieldErrors(prev => ({ ...prev, [e.target.name]: errorMsg }));
                                }}
                                className={`p-3 rounded-lg bg-white/5 border ${fieldErrors.lastName ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500 focus:bg-white/10 focus:outline-none transition text-sm`}
                            />
                            {fieldErrors.lastName && <span className="text-xs text-red-400/80 mt-0.5">{fieldErrors.lastName}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-300 font-medium">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            onChange={handleChange}
                            onBlur={(e) => {
                                const errorMsg = validateField(e.target.name, e.target.value, form);
                                setFieldErrors(prev => ({ ...prev, [e.target.name]: errorMsg }));
                            }}
                            className={`p-3 rounded-lg bg-white/5 border ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500 focus:bg-white/10 focus:outline-none transition text-sm`}
                        />
                        {fieldErrors.email && <span className="text-xs text-red-400/80 mt-0.5">{fieldErrors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-300 font-medium">Role</label>
                        <div className="relative">
                            <select
                                name="role"
                                onChange={handleChange}
                                onBlur={(e) => {
                                    const errorMsg = validateField(e.target.name, e.target.value, form);
                                    setFieldErrors(prev => ({ ...prev, [e.target.name]: errorMsg }));
                                }}
                                defaultValue=""
                                className={`w-full p-3 rounded-lg bg-white/5 border ${fieldErrors.role ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500 focus:bg-white/10 focus:outline-none transition appearance-none text-gray-300 text-sm`}
                            >
                                <option value="" disabled className="bg-indigo-950 text-gray-400">Select your role</option>
                                <option value="developer" className="bg-indigo-950">Developer</option>
                                <option value="student" className="bg-indigo-950">Student</option>
                                <option value="designer" className="bg-indigo-950">Designer</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        {fieldErrors.role && <span className="text-xs text-red-400/80 mt-0.5">{fieldErrors.role}</span>}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm text-gray-300 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    onBlur={(e) => {
                                        const errorMsg = validateField(e.target.name, e.target.value, form);
                                        setFieldErrors(prev => ({ ...prev, [e.target.name]: errorMsg }));
                                    }}
                                    className={`w-full p-3 rounded-lg bg-white/5 border ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500 focus:bg-white/10 focus:outline-none transition text-sm pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 flex flex-col gap-1 text-[11px] sm:text-xs">
                                <span className={form.password.length >= 6 ? "text-green-400 transition-colors" : "text-gray-500 transition-colors"}>
                                    {form.password.length >= 6 ? "✓" : "○"} At least 6 characters
                                </span>
                                <span className={/[A-Z]/.test(form.password) ? "text-green-400 transition-colors" : "text-gray-500 transition-colors"}>
                                    {/[A-Z]/.test(form.password) ? "✓" : "○"} 1 uppercase letter
                                </span>
                                <span className={/[0-9]/.test(form.password) ? "text-green-400 transition-colors" : "text-gray-500 transition-colors"}>
                                    {/[0-9]/.test(form.password) ? "✓" : "○"} 1 number
                                </span>
                                <span className={/[^A-Za-z0-9]/.test(form.password) ? "text-green-400 transition-colors" : "text-gray-500 transition-colors"}>
                                    {/[^A-Za-z0-9]/.test(form.password) ? "✓" : "○"} 1 special character
                                </span>
                            </div>
                            {fieldErrors.password && <span className="text-xs text-red-400/80 mt-1">{fieldErrors.password}</span>}
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm text-gray-300 font-medium">Confirm Password</label>
                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    onBlur={(e) => {
                                        const errorMsg = validateField(e.target.name, e.target.value, form);
                                        setFieldErrors(prev => ({ ...prev, [e.target.name]: errorMsg }));
                                    }}
                                    className={`w-full p-3 rounded-lg bg-white/5 border ${fieldErrors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500 focus:bg-white/10 focus:outline-none transition text-sm pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                    )}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && <span className="text-xs text-red-400/80 mt-0.5">{fieldErrors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="checkbox"
                            id="agreed"
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                            className="w-4 h-4 rounded border-gray-600 bg-white/5 focus:ring-purple-500 focus:ring-offset-gray-900 accent-purple-500 cursor-pointer"
                        />
                        <label htmlFor="agreed" className="text-sm text-gray-400 cursor-pointer select-none">
                            I agree to <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Terms</Link> and <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className={`mt-2 font-semibold text-lg p-3.5 rounded-lg transition-all flex items-center justify-center gap-2 ${!isFormValid || loading
                            ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/30'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] text-white'
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 flex items-center gap-4">
                    <hr className="flex-1 border-white/10" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Or continue with</span>
                    <hr className="flex-1 border-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button type="button" onClick={handleGithub} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium">
                        <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                    </button>
                    <button type="button" onClick={handleGoogle} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium">
                        <svg className="w-5 h-5 text-gray-200" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="text-sm text-gray-400 mt-8 text-center h-full">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-purple-400 font-semibold hover:text-purple-300 underline decoration-purple-500/30 underline-offset-4">
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
}