import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { authService } from "../../services/auth.service";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function RecoveryPassword() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const token = searchParams.get("recoveryToken");
    const email = searchParams.get("email");

    useEffect(() => {
        if (!token || !email) {
            setError("Missing recovery information. Please use the link sent to your email.");
        }
    }, [token, email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !email) {
            setError("Invalid recovery link.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.recoverPassword({
                token,
                email,
                newPassword,
            });
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Error occurred while resetting password");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-4 font-inter">
                <div className="w-full max-w-[448px] bg-white p-8 rounded-2xl shadow-sm text-center space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 font-manrope">
                        Password Reset Successful
                    </h2>
                    <p className="text-slate-600">
                        Your password has been reset successfully. Redirecting you to login...
                    </p>
                    <Link
                        to="/login"
                        className="block w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all"
                    >
                        Go to Login Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-4 font-inter">
            <div className="w-full max-w-[448px] space-y-8">
                {/* Header Section */}
                <div className="space-y-2">
                    <h2 className="text-[30px] font-extrabold text-slate-800 leading-[36px] font-manrope">
                        Reset Your Password
                    </h2>
                    <p className="text-base text-slate-700">
                        Enter your new password to regain access to your account.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                {/* Recovery Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 pl-1">
                            New Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="w-3 h-[15px] text-[#757684] group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-11 pr-12 py-4 bg-[#F2F4F7] border-0 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-[#757684]"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 pl-1">
                            Confirm New Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="w-3 h-[15px] text-[#757684] group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-11 pr-12 py-4 bg-[#F2F4F7] border-0 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-[#757684]"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !token || !email}
                        className="w-full py-4 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-lg shadow-button hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center pt-2">
                    <p className="text-base text-slate-700">
                        Remembered your password?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-primary hover:text-primary-light transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
