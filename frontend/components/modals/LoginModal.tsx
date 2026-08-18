"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  ShieldCheck,
  User as UserIcon,
  Stethoscope,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup" | "forgot";
}

// Google SVG Icon
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// GitHub SVG Icon
function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function LoginModal({
  isOpen,
  onClose,
  initialMode = "login",
}: LoginModalProps) {
  const { login, signup, loginWithOAuth, forgotPassword, user } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [role, setRole] = useState<"patient" | "physician">("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOAuthLogin = async (provider: "google" | "github" | "apple") => {
    setErrorText(null);
    setSuccessMessage(null);
    setOauthLoading(provider);
    try {
      const res = await loginWithOAuth(provider, role);
      if (res.success) {
        onClose();
        router.push("/dashboard");
      } else {
        setErrorText(res.error || `Failed to sign in with ${provider}.`);
      }
    } catch (err: any) {
      setErrorText(err.message || `An error occurred with ${provider} login.`);
    } finally {
      setOauthLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        if (!email || !password) {
          setErrorText("Please provide your email address and password.");
          setIsLoading(false);
          return;
        }
        const res = await login(email, password, role);
        if (!res.success) {
          setErrorText(res.error || "Invalid credentials.");
        } else {
          onClose();
          router.push("/dashboard");
        }
      } else if (mode === "signup") {
        if (!name || !email || !password) {
          setErrorText("Please complete all required fields.");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorText("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorText("Passwords do not match.");
          setIsLoading(false);
          return;
        }
        const res = await signup(name, email, password, role);
        if (!res.success) {
          setErrorText(res.error || "Registration failed.");
        } else {
          onClose();
          router.push("/dashboard");
        }
      } else if (mode === "forgot") {
        if (!email) {
          setErrorText("Please enter your registered email address.");
          setIsLoading(false);
          return;
        }
        const res = await forgotPassword(email);
        setSuccessMessage(res.message);
      }
    } catch (err: any) {
      setErrorText(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = async (type: "patient" | "physician") => {
    setErrorText(null);
    setSuccessMessage(null);
    setIsLoading(true);
    const demoEmail = type === "patient" ? "alex.morgan@health.org" : "doctor@hospital.org";
    const res = await login(demoEmail, "password123", type);
    setIsLoading(false);
    if (res.success) {
      onClose();
      router.push("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-600/30 text-sky-400 border border-sky-400/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">MediScan-AI Portal</h3>
              <p className="text-xs text-slate-400">Clinical & Patient Authentication</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close auth modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Mode Switch Tabs (Login / Sign Up) */}
          <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => {
                setMode("login");
                setErrorText(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-sky-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setMode("signup");
                setErrorText(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-sky-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role selector (Patient / Physician) */}
          {mode !== "forgot" && (
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === "patient"
                      ? "bg-white text-sky-700 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("physician")}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === "physician"
                      ? "bg-white text-teal-700 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Physician / Clinic</span>
                </button>
              </div>
            </div>
          )}

          {/* Social / OAuth Sign In Buttons */}
          {mode !== "forgot" && (
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                disabled={Boolean(oauthLoading)}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                id="oauth-continue-google-btn"
              >
                {oauthLoading === "google" ? (
                  <span className="text-slate-500">Connecting Google...</span>
                ) : (
                  <>
                    <GoogleIcon className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={Boolean(oauthLoading)}
                  className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <GitHubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("apple")}
                  disabled={Boolean(oauthLoading)}
                  className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 fill-slate-800" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.58-11.06-20.65-14.28-33.2-3.21-12.56-4.82-24.16-4.82-34.82 0-14.16 3.59-26.07 10.77-35.73 7.18-9.66 16.29-14.59 27.34-14.79 5.34 0 11.13 1.41 17.37 4.23 6.24 2.82 10.3 4.29 12.18 4.41 1.34 0 5.63-1.53 12.87-4.59 7.24-3.05 13.48-4.35 18.73-3.9 13.88.84 24.87 5.66 32.97 14.47-12.18 7.37-18.17 17.29-17.97 29.76.2 9.87 4.12 18.23 11.76 25.07 7.64 6.84 16.79 10.73 27.45 11.66-2.23 6.74-4.84 13.31-7.83 19.71zM119.22 33.39c0-6.95 2.58-13.62 7.74-20.02 5.16-6.4 11.59-10.46 19.29-12.18.59 2.01.88 4.09.88 6.24 0 7.08-2.69 13.94-8.07 20.58-5.38 6.64-11.99 10.63-19.84 11.97v-6.59z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 font-medium whitespace-nowrap">
                  or continue with email
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorText && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
                  />
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || Boolean(oauthLoading)}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : mode === "login" ? (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === "signup" ? (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Evaluation */}
          {mode === "login" && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">
                Evaluation Quick Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo("patient")}
                  className="py-2 px-3 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                >
                  <UserIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span>Demo Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickDemo("physician")}
                  className="py-2 px-3 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Demo Doctor</span>
                </button>
              </div>
            </div>
          )}

          {mode === "forgot" && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
