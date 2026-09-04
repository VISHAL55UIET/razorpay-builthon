import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
    ArrowRight,
    Sparkles,
    Brain,
    Clock3,
    TrendingUp,
    User,
    Mail,
    Lock,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!formData.name.trim()) {
            setError("Name is required");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email is required");
            return;
        }

        if (!formData.password) {
            setError("Password is required");
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters"
            );
            return;
        }


        try {

            setLoading(true);


            // -----------------------------
            // API CALL
            // -----------------------------

            const response = await axios.post(
                `${API_URL}/signup`,
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                }
            );


            const data = response.data;


            // -----------------------------
            // SAVE AUTH DATA
            // -----------------------------

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "tokenType",
                data.tokenType || "Bearer"
            );

            localStorage.setItem(
                "userId",
                data.userId
            );

            localStorage.setItem(
                "userName",
                data.name
            );

            localStorage.setItem(
                "userEmail",
                data.email
            );

            localStorage.setItem(
                "userRole",
                data.role
            );


            // Complete user object

            localStorage.setItem(
                "user",
                JSON.stringify({
                    userId: data.userId,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                })
            );


            setSuccess(
                "Account created successfully!"
            );


            // -----------------------------
            // REDIRECT
            // -----------------------------

            setTimeout(() => {

                navigate("/", {
                    replace: true,
                });

            }, 700);


        } catch (err) {

            console.error(
                "Signup error:",
                err
            );


            if (err.response?.data?.message) {

                setError(
                    err.response.data.message
                );

            } else if (err.response?.data) {

                setError(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : "Signup failed"
                );

            } else {

                setError(
                    "Unable to connect to server. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

 const handleGoogleSignup = () => {
    window.location.href =
        `${import.meta.env.VITE_API_URL.replace("/api", "")}/oauth2/authorization/google`;
};

    return (

        <div className="min-h-screen bg-[#F5F7FF] text-slate-900">

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                {/* Left glow */}

                <div className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[130px]" />


                {/* Right glow */}

                <div className="absolute right-[-100px] top-20 h-[550px] w-[550px] rounded-full bg-purple-400/15 blur-[140px]" />


                {/* Bottom glow */}

                <div className="absolute bottom-[-200px] left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-300/10 blur-[150px]" />

            </div>


            {/* ================================================= */}
            {/* NAVBAR */}
            {/* ================================================= */}

            <nav className="relative z-50 h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">

                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-10">


                    {/* ---------------- LOGO ---------------- */}

                    <Link
                        to="/signin"
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg font-bold text-white backdrop-blur">
                            AI
                        </div>


                        <div>

                            <div className="text-sm font-bold tracking-wide text-white">
                                REVENUE RECOVERY
                            </div>

                            <div className="text-xs text-blue-100">
                                AI Payment Platform
                            </div>

                        </div>

                    </Link>


                    {/* ---------------- CENTER ---------------- */}

                    <Link
                        to="/how-it-works"
                        className="hidden items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 md:flex"
                    >

                        <Sparkles size={16} />

                        How it works

                    </Link>


                    {/* ---------------- RIGHT ---------------- */}

                    <div className="flex items-center gap-5">

                        <Link
                            to="/signin"
                            className="text-sm font-medium text-white transition hover:text-blue-100"
                        >
                            Sign in
                        </Link>


                        <div className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white">
                            Create account
                        </div>

                    </div>

                </div>

            </nav>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="relative z-10">

                <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">


                    {/* ================================================= */}
                    {/* LEFT SIDE */}
                    {/* ================================================= */}

                    <section>


                        {/* ---------------- BADGE ---------------- */}

                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-2 text-xs font-semibold tracking-[0.18em] text-indigo-500 shadow-sm">

                            <Sparkles size={14} />

                            AI-POWERED PAYMENTS

                        </div>


                        {/* ---------------- HEADING ---------------- */}

                        <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight text-[#101B45] sm:text-6xl lg:text-7xl">

                            Start recovering
                            <br />

                            revenue.
                            <br />

                            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                Automatically.
                            </span>

                        </h1>


                        {/* ---------------- DESCRIPTION ---------------- */}

                        <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">

                            Create your Revenue Recovery account and start
                            detecting failed payments, understanding revenue
                            risk, and triggering intelligent recovery actions.

                        </p>


                        {/* ================================================= */}
                        {/* FEATURE CARDS */}
                        {/* ================================================= */}

                        <div className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">


                            {/* AI DETECTION */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100">

                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                                    <Brain size={21} />

                                </div>


                                <h3 className="text-base font-semibold text-[#152044]">
                                    AI Detection
                                </h3>


                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                    Intelligent failure detection
                                </p>

                            </div>


                            {/* 24/7 */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100">

                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                                    <Clock3 size={21} />

                                </div>


                                <h3 className="text-base font-semibold text-[#152044]">
                                    24/7 Monitoring
                                </h3>


                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                    Continuous revenue monitoring
                                </p>

                            </div>


                            {/* SMART RECOVERY */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100">

                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                                    <TrendingUp size={21} />

                                </div>


                                <h3 className="text-base font-semibold text-[#152044]">
                                    Smart Recovery
                                </h3>


                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                    Automated recovery actions
                                </p>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* BOTTOM INFO */}
                        {/* ================================================= */}

                        <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">

                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-300" />

                            Create an account to access your revenue recovery dashboard.

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* SIGNUP CARD */}
                    {/* ================================================= */}

                    <section className="flex justify-center lg:justify-end">

                        <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/40 sm:p-9">


                            {/* ---------------- AI LOGO ---------------- */}

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-300/40">

                                AI

                            </div>


                            {/* ---------------- CARD TITLE ---------------- */}

                            <div className="mt-7">

                                <p className="text-xs font-bold tracking-[0.2em] text-indigo-500">
                                    GET STARTED
                                </p>


                                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#101B45] sm:text-4xl">
                                    Create account
                                </h2>


                                <p className="mt-2 text-sm text-slate-500">
                                    Start recovering your payment revenue.
                                </p>

                            </div>


                            {/* ================================================= */}
                            {/* FORM */}
                            {/* ================================================= */}

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8"
                            >


                                {/* ---------------- NAME ---------------- */}

                                <div className="mb-5">

                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Full Name
                                    </label>


                                    <div className="relative">

                                        <User
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />


                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            autoComplete="name"
                                            disabled={loading}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                    </div>

                                </div>


                                {/* ---------------- EMAIL ---------------- */}

                                <div className="mb-5">

                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Email
                                    </label>


                                    <div className="relative">

                                        <Mail
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />


                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            disabled={loading}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                    </div>

                                </div>


                                {/* ---------------- PASSWORD ---------------- */}

                                <div className="mb-5">

                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>


                                    <div className="relative">

                                        <Lock
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />


                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                    </div>

                                </div>


                                {/* ================================================= */}
                                {/* ERROR */}
                                {/* ================================================= */}

                                {error && (

                                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                                        {error}

                                    </div>

                                )}


                                {/* ================================================= */}
                                {/* SUCCESS */}
                                {/* ================================================= */}

                                {success && (

                                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">

                                        {success}

                                    </div>

                                )}


                                {/* ================================================= */}
                                {/* CREATE ACCOUNT */}
                                {/* ================================================= */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-300/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"
                                    }


                                    {!loading && (

                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-1"
                                        />

                                    )}

                                </button>

                            </form>


                            {/* ================================================= */}
                            {/* OR */}
                            {/* ================================================= */}

                            <div className="my-7 flex items-center gap-4">

                                <div className="h-px flex-1 bg-slate-200" />

                                <span className="text-xs font-medium text-slate-400">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-slate-200" />

                            </div>


                            {/* ================================================= */}
                            {/* GOOGLE BUTTON */}
                            {/* ================================================= */}

                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50 hover:shadow-md"
                            >

                                {/* Google Logo */}

                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                >

                                    <path
                                        fill="#4285F4"
                                        d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
                                    />

                                    <path
                                        fill="#34A853"
                                        d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.5Z"
                                    />

                                    <path
                                        fill="#FBBC05"
                                        d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.08.31-1.59V7.88H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.12l3.25-2.53Z"
                                    />

                                    <path
                                        fill="#EA4335"
                                        d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.47 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53 3.25-2.53C7.31 8.1 9.46 6.38 12 6.38Z"
                                    />

                                </svg>


                                Continue with Google


                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />

                            </button>


                            {/* ================================================= */}
                            {/* SIGN IN */}
                            {/* ================================================= */}
                                 {/* ================================================= */}
{/* RAZORPAY TRUST */}
{/* ================================================= */}

<div className="mt-6 border-t border-slate-100 pt-5">

    <div className="flex items-center justify-center gap-2">

        <span className="text-xs text-slate-400">
            Payments powered by
        </span>

        <span className="text-sm font-bold tracking-tight text-[#0B84FF]">
            Razorpay
        </span>

    </div>

</div>
                            <p className="mt-6 text-center text-sm text-slate-500">

                                Already have an account?{" "}

                                <Link
                                    to="/signin"
                                    className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                                >
                                    Sign in
                                </Link>

                            </p>
                            

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Signup;