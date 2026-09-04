import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Clock3,
  TrendingUp,
  PlayCircle,
  Mail,
  Lock,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  setLoading(true);

  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      formData
    );

    const data = response.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      })
    );
    const redirectTo =
    location.state?.from?.pathname || "/";

    navigate(redirectTo, {
      replace: true,
    });
  } catch (err) {
    console.error("Login error:", err);
    setError(
      err.response?.data?.message ||
      "Invalid email or password"
    );
  } finally {
    setLoading(false);
  }
};
const handleGoogleLogin = () => {
  window.location.href =
    `${import.meta.env.VITE_API_URL.replace("/api", "")}/oauth2/authorization/google`;
};
  
const scrollToSection = (id) => {
  document
    .getElementById(id)  ?.scrollIntoView({  behavior: "smooth",});
};
  return (
    <div className="min-h-screen bg-[#f4f7ff] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-indigo-200/30 bg-gradient-to-r from-[#2639d8] via-[#4f46e5] to-[#8b2cf5] text-white shadow-[0_8px_30px_rgba(79,70,229,0.25)]">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">
          <Link
            to="/signin"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-white ring-1 ring-white/30">
              AI
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">
                REVENUE RECOVERY
              </p>
              <p className="text-xs text-indigo-100">
                AI Payment Platform
              </p>
            </div>
          </Link>
          <nav className="hidden items-center lg:flex">
            <button
              onClick={() =>
                scrollToSection("how-it-works")
              }
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <Sparkles size={16} />
              <span>
                How it works
              </span>
            </button>
          </nav>
          <div className="flex items-center gap-6">
            <button
              onClick={() =>
                scrollToSection("platform")
              }
              className="hidden text-sm text-indigo-100 transition hover:text-white md:block"
            >
              Platform
            </button>
            <button
              onClick={() =>
                scrollToSection("recovery")
              }
              className="hidden text-sm text-indigo-100 transition hover:text-white md:block"
            >
              Recovery
            </button>
            <button
              onClick={() =>
                scrollToSection("analytics")
              }
              className="hidden text-sm text-indigo-100 transition hover:text-white md:block"
            >
              Analytics
            </button>
            <Link
              to="/signup"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-violet-700"
            >
              Create account
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-[#f5f7ff] via-[#eef2ff] to-[#f7f1ff]">
          <div className="pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-indigo-300/30 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-blue-200/30 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-violet-300/25 blur-[120px]" />
          <div className="pointer-events-none absolute left-[48%] top-[40%] h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_15px_5px_rgba(99,102,241,0.25)]" />
          <div className="pointer-events-none absolute right-[10%] top-[55%] h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_15px_5px_rgba(168,85,247,0.25)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-[1500px] items-center gap-14 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-16">
            <div className="max-w-2xl">
              
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-indigo-600 shadow-sm backdrop-blur">
                <Sparkles size={15} />
                AI-POWERED PAYMENTS
              </div>
              
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Recover revenue.
                <br />
                <span className="bg-gradient-to-r from-[#315ee8] via-[#6246ea] to-[#9b2cf5] bg-clip-text text-transparent">
                  Automatically.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Detect failed payments, understand why revenue is
                at risk, and trigger the right recovery action —
                all from one intelligent platform.
              </p>
              <div
                id="platform"
                className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
              >
                <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-[0_10px_35px_rgba(71,85,150,0.10)] backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_15px_40px_rgba(71,85,150,0.15)]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Brain size={22} />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    AI Detection
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Intelligent failure detection
                  </p>
                </div>
                <div
                  id="recovery"
                  className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-[0_10px_35px_rgba(71,85,150,0.10)] backdrop-blur transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_15px_40px_rgba(71,85,150,0.15)]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Clock3 size={22} />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    24/7 Monitoring
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Continuous revenue monitoring
                  </p>
                </div>

                {/* Recovery */}
                <div
                  id="analytics"
                  className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-[0_10px_35px_rgba(71,85,150,0.10)] backdrop-blur transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(71,85,150,0.15)]"
                >

                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                    <TrendingUp size={22} />

                  </div>

                  <h3 className="font-semibold text-slate-900">
                    Smart Recovery
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Automated recovery actions
                  </p>

                </div>

              </div>


              {/* =================================================
                  HOW IT WORKS BUTTON
              ================================================= */}

              <button
                onClick={() =>
                  scrollToSection("how-it-works")
                }
                className="group mt-9 inline-flex items-center gap-3 rounded-xl border border-indigo-400 bg-white px-6 py-3.5 font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md"
              >

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">

                  <PlayCircle size={18} />

                </span>

                See how it works

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />

              </button>


              {/* Bottom Status */}

              <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">

                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_3px_rgba(34,197,94,0.20)]" />

                Sign in to access your revenue recovery dashboard

              </div>

            </div>


            {/* =================================================
                RIGHT LOGIN CARD
            ================================================= */}

            <div className="relative mx-auto w-full max-w-[550px]">

              {/* Glow */}

              <div className="absolute -inset-8 rounded-[40px] bg-indigo-300/25 blur-3xl" />


              {/* Card */}

              <div className="relative rounded-[28px] border border-white/80 bg-white/95 p-7 shadow-[0_30px_80px_rgba(71,85,150,0.20)] backdrop-blur-xl sm:p-9 lg:p-10">


                {/* AI Logo */}

                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-xl font-bold text-white shadow-[0_10px_30px_rgba(79,70,229,0.30)]">

                  AI

                </div>


                {/* Heading */}

                <div className="mb-8">

                  <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
                    WELCOME BACK
                  </p>

                  <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Access your Revenue Recovery workspace.
                  </p>

                </div>


                {/* =================================================
                    LOGIN FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                  {/* EMAIL */}

                  <div className="mb-5">

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pl-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />

                    </div>

                  </div>


                  {/* PASSWORD */}

                  <div className="mb-5">

                    <div className="mb-2 flex items-center justify-between">

                      <label className="block text-sm font-semibold text-slate-700">
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
                      >
                        Forgot password?
                      </button>

                    </div>


                    <div className="relative">

                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pl-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />

                    </div>

                  </div>


                  {/* ERROR */}

                  {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {error}
                    </div>
                  )}


                  {/* LOGIN BUTTON */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(124,58,237,0.30)] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading
                      ? "Signing in..."
                      : "Sign in to dashboard"}

                    {!loading && (
                      <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}

                  </button>

                </form>


                {/* =================================================
                    GOOGLE LOGIN
                ================================================= */}

                <div className="my-7 flex items-center gap-4">

                  <div className="h-px flex-1 bg-slate-200" />

                  <span className="text-xs font-medium text-slate-400">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-slate-200" />

                </div>


                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >

                  {/* Google Icon */}

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.99c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.75 9.75 0 0 0 12 21.99Z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.53 14.1A5.86 5.86 0 0 1 6.23 12c0-.73.13-1.44.3-2.1V7.38H3.28A9.99 9.99 0 0 0 2.25 12c0 1.61.39 3.13 1.03 4.62l3.25-2.52Z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 5.87c1.43 0 2.72.49 3.74 1.45l2.8-2.8C16.84 2.91 14.63 2 12 2a9.75 9.75 0 0 0-8.72 5.38L6.53 9.9C7.3 7.59 9.46 5.87 12 5.87Z"
                    />
                  </svg>

                  Continue with Google

                </button>

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
                <p className="mt-7 text-center text-sm text-slate-500">

                  Don't have an account?{" "}

                  <Link
                    to="/signup"
                    className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                  >
                    Create one
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          id="how-it-works"
          className="border-t border-slate-200 bg-white px-6 py-24"
        >

          <div className="mx-auto max-w-6xl">

            {/* Section heading */}

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-bold tracking-[0.2em] text-indigo-600">
                HOW IT WORKS
              </p>

              <h2 className="mt-3 text-4xl font-bold text-slate-950">
                Recover lost revenue in three steps.
              </h2>

              <p className="mt-4 text-slate-500">
                Revenue Recovery continuously monitors your payment
                activity and helps identify the best recovery action.
              </p>

            </div>


            {/* Steps */}

            <div className="mt-14 grid gap-6 md:grid-cols-3">

              {/* STEP 1 */}

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(71,85,150,0.08)] transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20">
                  01
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  Detect
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Identify failed payments and revenue at risk
                  automatically.
                </p>

              </div>


              {/* STEP 2 */}

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(71,85,150,0.08)] transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 font-bold text-white shadow-lg shadow-purple-600/20">
                  02
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  Understand
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Analyze payment failures and determine the
                  appropriate recovery strategy.
                </p>

              </div>


              {/* STEP 3 */}

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(71,85,150,0.08)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
                  03
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  Recover
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Trigger the right recovery action and track
                  the recovered revenue.
                </p>

              </div>

            </div>


            {/* Bottom CTA */}

            <div className="mt-14 text-center">

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >

                Start recovering revenue

                <ArrowRight size={18} />

              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}



export default SignIn;
