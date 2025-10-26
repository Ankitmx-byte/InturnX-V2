import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "demo@inturnx.com",
    password: "demo123",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Animations removed as requested
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-4">
      <div className="login-card bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 w-full max-w-md text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">Welcome Back 👋</h2>
        <p className="text-gray-300 mb-8">Sign in to continue your learning journey</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input w-full p-4 bg-white/30 border border-white/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14A44D] focus:border-transparent transition-all duration-300"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input w-full p-4 bg-white/30 border border-white/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14A44D] focus:border-transparent transition-all duration-300"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#FF4B2B] to-[#5F2EEA] rounded-xl font-semibold text-white hover:shadow-[#14A44D]/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                setError("");
                const result = await demoLogin();
                if (result.success) {
                  navigate("/");
                } else {
                  setError(result.message);
                }
                setLoading(false);
              }}
              disabled={loading}
              className="w-full py-3 bg-white/20 border border-white/30 rounded-xl font-semibold text-white hover:bg-white/30 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Quick Demo Login"}
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          <div className="text-gray-300 text-sm">
            <strong>Demo Credentials:</strong><br />
            Email: demo@inturnx.com<br />
            Password: demo123
          </div>
          <p className="text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#14A44D] font-semibold hover:text-[#14A44D]/80 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
