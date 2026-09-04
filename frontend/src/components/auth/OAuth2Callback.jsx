import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2Callback() {

  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(
      window.location.search
    );

    const token = params.get("token");

    // ==========================================
    // GOOGLE LOGIN SUCCESS
    // ==========================================

    if (token) {

      // Save JWT
      localStorage.setItem(
        "token",
        token
      );

      // Get actual user information
      const user = {
        id: params.get("userId"),
        name: params.get("name"),
        email: params.get("email"),
        role: params.get("role") || "USER",
      };

      console.log(
        "Google user:",
        user
      );

      // Save actual user
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // Clean URL
      window.history.replaceState(
        {},
        document.title,
        "/oauth2/callback"
      );

      // Go dashboard
      navigate("/", {
        replace: true,
      });

      return;
    }

    // ==========================================
    // REACT STRICT MODE
    // ==========================================

    const existingToken =
      localStorage.getItem("token");

    if (existingToken) {

      navigate("/", {
        replace: true,
      });

      return;
    }

    // ==========================================
    // LOGIN FAILED
    // ==========================================

    navigate("/signin", {
      replace: true,
    });

  }, [navigate]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">

      <div className="text-center">

        <div
          className="
            mx-auto
            mb-4
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-indigo-200
            border-t-indigo-600
          "
        />

        <p className="text-slate-600">
          Signing you in...
        </p>

      </div>

    </div>
  );
}

export default OAuth2Callback;