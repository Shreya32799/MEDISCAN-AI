"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, User, Stethoscope } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Chatbot from "@/components/chatbot/Chatbot";

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

export default function LoginPage() {
  const { login, loginWithOAuth, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "physician">("patient");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  if (user) {
    if (typeof window !== "undefined") {
      router.push("/dashboard");
    }
  }

  const handleOAuthLogin = async (provider: "google" | "github" | "apple") => {
    setErrorText(null);
    setOauthLoading(provider);
    try {
      const res = await loginWithOAuth(provider, role);
      if (res.success) {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setIsLoading(true);
    const res = await login(email, password, role);
    setIsLoading(false);
    if (!res.success) {
      setErrorText(res.error || "Invalid credentials.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleQuickDemo = async (type: "patient" | "physician") => {
    const demoEmail = type === "patient" ? "alex.morgan@health.org" : "doctor@hospital.org";
    setIsLoading(true);
    const res = await login(demoEmail, "password123", type);
    setIsLoading(false);
    if (res.success) {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        onOpenAssessment={() => router.push("/assessment")}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      <div className="pt-28 pb-16 max-w-md mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Sign In to MediScan-AI</h1>
            <p className="text-xs text-slate-500">Access your private health screening dashboard & reports</p>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === "patient" ? "bg-white text-sky-700 font-bold shadow-xs" : "text-slate-600"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("physician")}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === "physician" ? "bg-white text-teal-700 font-bold shadow-xs" : "text-slate-600"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Physician</span>
              </button>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={Boolean(oauthLoading)}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
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
                or sign in with email
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>
          </div>

          {errorText && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
              {errorText}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-sky-600 hover:text-sky-700"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || Boolean(oauthLoading)}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In to Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Evaluation Fast Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("patient")}
                className="py-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
              >
                Demo Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("physician")}
                className="py-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
              >
                Demo Physician
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-1">
            Don't have an account?{" "}
            <Link href="/signup" className="text-sky-600 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <Footer onOpenChatbot={() => setChatbotOpen(true)} />
      <Chatbot isOpenExternal={chatbotOpen} onToggleExternal={setChatbotOpen} />
    </main>
  );
}
