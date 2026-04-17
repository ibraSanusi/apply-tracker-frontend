import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      login(response.data, response.token);

      if (response.data.isVerified) {
        navigate("/assistant");
      } else {
        navigate("/verify-email");
      }
    } catch (err: any) {
      setError(err.message || "Error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const sendRecoveryEmail = async (email: string) => {
    try {
      await authService.sendRecoveryEmail(email);
      setError("Recovery password email sent successfully");
    } catch (err: any) {
      setError(err.message || "Error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-[448px] space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h2 className="text-[30px] font-extrabold text-slate-800 leading-[36px] font-manrope">
            Welcome Back
          </h2>
          <p className="text-base text-slate-700">
            Sign in to continue your career journey.
          </p>
        </div>

        {/* Social Login Section */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-transparent rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm text-sm font-semibold text-slate-700">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-transparent rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm text-sm font-semibold text-slate-700">
            <img
              src="https://github.githubassets.com/favicons/favicon.png"
              alt="Github"
              className="w-5 h-5"
            />
            <span>Github</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#E6E8EA]"></div>
          <span className="text-[12px] font-normal text-[#757684] uppercase tracking-[1.2px]">
            Or with Email
          </span>
          <div className="h-px flex-1 bg-[#E6E8EA]"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 pl-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-[15px] h-[12px] text-[#757684] group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-4 bg-[#F2F4F7] border-0 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-[#757684]"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between pl-1">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => sendRecoveryEmail(email)}
                title="Forgot password?"
                className="text-sm font-semibold text-primary hover:text-primary-light transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-3 h-[15px] text-[#757684] group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-11 pr-12 py-4 bg-[#F2F4F7] border-0 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-[#757684]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#757684] hover:text-slate-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-[#C5C5D4] text-primary focus:ring-primary transition-all cursor-pointer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label
              htmlFor="remember"
              className="text-sm text-slate-700 cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-lg shadow-button hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-2">
          <p className="text-base text-slate-700">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary-light transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="flex justify-center gap-8 pt-4">
          <Link
            to="/privacy"
            className="text-[12px] text-[#757684] uppercase tracking-[0.6px] hover:text-slate-700 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-[12px] text-[#757684] uppercase tracking-[0.6px] hover:text-slate-700 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
