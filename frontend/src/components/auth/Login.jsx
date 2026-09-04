import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

        if (!formData.email.trim()) {
            setError("Email is required");
            return;
        }

        if (!formData.password) {
            setError("Password is required");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/login`,
                {
                    email: formData.email,
                    password: formData.password,
                }
            );

            const data = response.data;

            console.log("Login response:", data);

            /*
             * Backend se JWT response
             * milne ke baad localStorage me save.
             */
            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "tokenType",
                data.tokenType || "Bearer"
            );

            if (data.userId !== undefined) {
                localStorage.setItem(
                    "userId",
                    data.userId
                );
            }

            if (data.name) {
                localStorage.setItem(
                    "userName",
                    data.name
                );
            }

            if (data.email) {
                localStorage.setItem(
                    "userEmail",
                    data.email
                );
            }

            if (data.role) {
                localStorage.setItem(
                    "userRole",
                    data.role
                );
            }

            // Dashboard par redirect
            navigate("/", { replace: true });

        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (typeof err.response?.data === "string") {
                setError(err.response.data);
            } else if (err.response?.status === 401) {
                setError("Invalid email or password");
            } else {
                setError(
                    "Unable to connect to server. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                        AI
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to your Revenue Recovery account
                    </p>

                </div>


                {/* Login Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="mb-5">

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>


                    {/* Signup */}
                    <div className="mt-6 text-center text-sm text-slate-500">

                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Create account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;