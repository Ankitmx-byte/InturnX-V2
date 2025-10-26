import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const result = await signup(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-4">
      <div className="signup-card bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 w-full max-w-md text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">Join InturnX 🚀</h2>
        <p className="text-gray-300 mb-8">Start your AI-powered learning journey today</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input w-full p-4 bg-white/30 border border-white/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14A44D] focus:border-transparent transition-all duration-300"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
              autoComplete="new-password"
              required
              className="input w-full p-4 bg-white/30 border border-white/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14A44D] focus:border-transparent transition-all duration-300"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="input w-full p-4 bg-white/30 border border-white/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14A44D] focus:border-transparent transition-all duration-300"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#FF4B2B] to-[#5F2EEA] rounded-xl font-semibold text-white hover:shadow-[#14A44D]/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-[#14A44D] font-semibold hover:text-[#14A44D]/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
