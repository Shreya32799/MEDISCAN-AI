"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Activity,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Bot,
  User as UserIcon,
  LayoutDashboard,
  Clock,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/modals/LoginModal";

interface NavbarProps {
  onOpenAssessment?: () => void;
  onOpenChatbot?: () => void;
}

export default function Navbar({
  onOpenAssessment = () => {},
  onOpenChatbot = () => {},
}: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const publicNavLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Features", href: "/#features" },
    { name: "Health Assessment", href: "/#predictions" },
    { name: "FAQ", href: "/#faq" },
  ];

  const authNavLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Assessments", href: "/assessment" },
    { name: "History", href: "/history" },
  ];

  const activeLinks = user ? authNavLinks : publicNavLinks;

  const handleStartAssessment = () => {
    if (onOpenAssessment) {
      onOpenAssessment();
    } else {
      router.push("/assessment");
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-2.5"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              id="navbar-brand-logo"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-600 to-sky-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  MediScan<span className="text-teal-600">-AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 -mt-1">
                  Health Risk Screening
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7">
              {activeLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-sky-700 transition-colors relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-600 transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* AI Assistant Button */}
              <button
                onClick={onOpenChatbot}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-sky-700 hover:bg-slate-100/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200/80"
                id="navbar-ai-assistant-btn"
              >
                <Bot className="w-4 h-4 text-sky-600" />
                <span>AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {user ? (
                /* Authenticated User Menu */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-slate-50 transition-all cursor-pointer"
                    id="navbar-user-dropdown-btn"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 z-50 text-xs"
                      >
                        <div className="px-3 py-2 border-b border-slate-100">
                          <span className="font-bold text-slate-900 block truncate">{user.name}</span>
                          <span className="text-[11px] text-slate-400 truncate block">{user.email}</span>
                        </div>

                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-sky-600" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-teal-600" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/history"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                        >
                          <Clock className="w-4 h-4 text-indigo-600" />
                          <span>Assessment History</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors text-left cursor-pointer border-t border-slate-100"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Unauthenticated User: Login Button */
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-sky-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  id="navbar-login-btn"
                >
                  Login
                </button>
              )}

              {/* Start Assessment CTA */}
              <button
                onClick={handleStartAssessment}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 hover:from-sky-500 hover:to-teal-500 rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 group cursor-pointer active:scale-95"
                id="navbar-start-assessment-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>Start Assessment</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={onOpenChatbot}
                className="p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Open AI Assistant"
              >
                <Bot className="w-5 h-5 text-sky-600" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle menu"
                id="navbar-mobile-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 overflow-hidden shadow-xl"
            >
              <div className="px-6 py-6 space-y-4">
                <div className="flex flex-col space-y-2">
                  {activeLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-slate-700 hover:text-sky-600 py-2.5 border-b border-slate-100 flex items-center justify-between"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2.5 text-center text-slate-700 font-bold text-xs bg-slate-100 rounded-xl flex items-center justify-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-sky-600" />
                        <span>Profile ({user.name})</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 text-center text-rose-700 font-bold text-xs bg-rose-50 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginModalOpen(true);
                      }}
                      className="w-full py-2.5 text-center text-slate-700 font-bold text-xs bg-slate-100 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Sign In / Create Account</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleStartAssessment();
                    }}
                    className="w-full py-3 text-center text-white font-bold text-xs bg-gradient-to-r from-sky-600 to-teal-600 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-sky-200" />
                    <span>Start Health Assessment</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Login / Sign Up Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
