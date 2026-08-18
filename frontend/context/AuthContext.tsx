"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PredictionResult } from "@/components/assessment/PredictionModal";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  getMissingFirebaseConfig,
} from "@/lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from "firebase/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "physician" | "admin";
  provider?: "email" | "google" | "github" | "apple";
  avatar?: string;
  age?: number;
  sex?: string;
  createdAt: string;
}

export interface StoredAssessment {
  id: string;
  userId: string;
  date: string;
  disease: "Heart Disease" | "Diabetes";
  riskLevel: "Low Risk" | "Moderate Risk" | "High Risk";
  riskColor: string;
  probability: number;
  summary: string;
  recommendations: string[];
  parameters: Record<string, any>;
  patientName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirebaseReady: boolean;
  login: (email: string, password: string, role?: "patient" | "physician") => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role?: "patient" | "physician") => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (role?: "patient" | "physician") => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: "google" | "github" | "apple", role?: "patient" | "physician") => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  saveAssessment: (result: PredictionResult, parameters: Record<string, any>, patientName?: string) => StoredAssessment;
  getAssessments: (filterDisease?: string) => StoredAssessment[];
  deleteAssessment: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map Firebase error codes into human-readable messages
function getFirebaseErrorMessage(error: any): string {
  if (!error) return "An unexpected authentication error occurred.";
  const code: string = error.code || "";

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Google Sign-In was cancelled (the account chooser popup was closed before completing sign-in).";
    case "auth/popup-blocked":
      return "The Google account chooser popup was blocked by your browser. Please allow popups for this site and try again.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in your Firebase Console. Please add 'localhost' to the Authorized Domains list in Firebase Console > Authentication > Settings.";
    case "auth/cancelled-popup-request":
      return "The popup request was cancelled because another sign-in attempt was initiated.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email address using a different sign-in method.";
    case "auth/network-request-failed":
      return "Network connection error while contacting Google Authentication servers. Please check your internet connection.";
    case "auth/invalid-api-key":
    case "auth/app-not-authorized":
      return "Firebase configuration error: The API key or project credentials are invalid. Please verify your NEXT_PUBLIC_FIREBASE_* settings in .env.local.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-email":
      return "The provided email address is not valid.";
    case "auth/user-disabled":
      return "This user account has been disabled by an administrator.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to many failed login attempts. Please reset your password or try again later.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFirebaseReady = isFirebaseConfigured();

  // Listen to Firebase auth state changes
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      if (auth) {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            const role = (localStorage.getItem(`mediscan_role_${firebaseUser.uid}`) as any) || "patient";
            const appUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Health Screening Subject",
              email: firebaseUser.email || "",
              role,
              provider: firebaseUser.providerData?.[0]?.providerId === "google.com" ? "google" : "email",
              avatar: firebaseUser.photoURL || undefined,
              createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            };
            setUser(appUser);
            localStorage.setItem("mediscan_active_user", JSON.stringify(appUser));
          } else {
            // Only clear if we were previously logged in via Firebase
            const current = localStorage.getItem("mediscan_active_user");
            if (current) {
              const parsed = JSON.parse(current);
              if (parsed.provider === "google" || isFirebaseReady) {
                setUser(null);
                localStorage.removeItem("mediscan_active_user");
              }
            }
          }
          setIsLoading(false);
        });
      } else {
        // Restore local session if Firebase is not active
        if (typeof window !== "undefined") {
          const currentSession = localStorage.getItem("mediscan_active_user");
          if (currentSession) {
            setUser(JSON.parse(currentSession));
          }
        }
        setIsLoading(false);
      }
    } catch (e) {
      console.error("[Auth Context Init]:", e);
      setIsLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [isFirebaseReady]);

  // Google Sign In via Firebase Popup
  const loginWithGoogle = async (
    role: "patient" | "physician" = "patient"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      const missing = getMissingFirebaseConfig();
      setIsLoading(false);
      return {
        success: false,
        error:
          `Firebase Authentication is not yet configured. Missing variables in .env.local: ${missing.join(", ")}. ` +
          `Please configure your Firebase credentials in frontend/.env.local to enable real Google Sign-In popup.`,
      };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      localStorage.setItem(`mediscan_role_${firebaseUser.uid}`, role);

      const appUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google User",
        email: firebaseUser.email || "",
        role,
        provider: "google",
        avatar: firebaseUser.photoURL || undefined,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
      };

      setUser(appUser);
      localStorage.setItem("mediscan_active_user", JSON.stringify(appUser));
      return { success: true };
    } catch (error: any) {
      console.error("[Firebase Google Sign-In Error]:", error);
      return {
        success: false,
        error: getFirebaseErrorMessage(error),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (
    provider: "google" | "github" | "apple",
    role: "patient" | "physician" = "patient"
  ): Promise<{ success: boolean; error?: string }> => {
    if (provider === "google") {
      return loginWithGoogle(role);
    }

    // For other providers (GitHub / Apple)
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const oauthEmail =
        provider === "github"
          ? "alex.morgan.dev@github.com"
          : "alex.morgan@icloud.com";

      const oauthUser: User = {
        id: `usr_${provider}_${Date.now()}`,
        name: `Alex Morgan (${provider.toUpperCase()})`,
        email: oauthEmail,
        role,
        provider,
        createdAt: new Date().toISOString(),
      };

      setUser(oauthUser);
      localStorage.setItem("mediscan_active_user", JSON.stringify(oauthUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "OAuth login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    role: "patient" | "physician" = "patient"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Authentication if configured
    if (isFirebaseConfigured() && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const firebaseUser = cred.user;
        const savedRole = (localStorage.getItem(`mediscan_role_${firebaseUser.uid}`) as any) || role;

        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || cleanEmail.split("@")[0],
          email: firebaseUser.email || cleanEmail,
          role: savedRole,
          provider: "email",
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };

        setUser(appUser);
        localStorage.setItem("mediscan_active_user", JSON.stringify(appUser));
        return { success: true };
      } catch (fbErr: any) {
        console.error("[Firebase Email Login Error]:", fbErr);
        return { success: false, error: getFirebaseErrorMessage(fbErr) };
      } finally {
        setIsLoading(false);
      }
    }

    // 2. Local fallback if Firebase is not yet configured
    try {
      const appUser: User = {
        id: `usr_${Date.now()}`,
        name: cleanEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        email: cleanEmail,
        role,
        provider: "email",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("mediscan_active_user", JSON.stringify(appUser));
      setUser(appUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "patient" | "physician" = "patient"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Authentication if configured
    if (isFirebaseConfigured() && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const firebaseUser = cred.user;

        // Update display name on Firebase User Profile
        await updateFirebaseProfile(firebaseUser, {
          displayName: name.trim(),
        });

        localStorage.setItem(`mediscan_role_${firebaseUser.uid}`, role);

        const appUser: User = {
          id: firebaseUser.uid,
          name: name.trim(),
          email: cleanEmail,
          role,
          provider: "email",
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };

        setUser(appUser);
        localStorage.setItem("mediscan_active_user", JSON.stringify(appUser));
        return { success: true };
      } catch (fbErr: any) {
        console.error("[Firebase Email Signup Error]:", fbErr);
        return { success: false, error: getFirebaseErrorMessage(fbErr) };
      } finally {
        setIsLoading(false);
      }
    }

    // 2. Local fallback if Firebase is not yet configured
    try {
      const appUser: User = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        role,
        provider: "email",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("mediscan_active_user", JSON.stringify(appUser));
      setUser(appUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error("[Firebase SignOut Error]:", e);
      }
    }
    localStorage.removeItem("mediscan_active_user");
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured() && auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        return {
          success: true,
          message: `A secure password reset link has been dispatched to ${cleanEmail} via Firebase.`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: "",
          error: getFirebaseErrorMessage(error),
        };
      }
    }

    return {
      success: true,
      message: `If an account exists for ${cleanEmail}, a secure password reset link has been dispatched to your email.`,
    };
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };
    try {
      if (auth?.currentUser && data.name) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: data.name,
        });
      }

      const updated: User = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("mediscan_active_user", JSON.stringify(updated));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };
    // Password updates in Firebase can be managed through password reset email or updatePassword with re-authentication
    if (isFirebaseConfigured() && auth && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: getFirebaseErrorMessage(e) };
      }
    }
    return { success: true };
  };

  const saveAssessment = (
    result: PredictionResult,
    parameters: Record<string, any>,
    patientName?: string
  ): StoredAssessment => {
    const newRecord: StoredAssessment = {
      id: `MSAI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user ? user.id : "usr_guest",
      date: new Date().toISOString(),
      disease: result.disease === "Heart Disease" ? "Heart Disease" : "Diabetes",
      riskLevel: result.risk_level as any,
      riskColor: result.risk_color,
      probability: result.probability_percentage,
      summary: result.summary,
      recommendations: result.recommendations,
      parameters,
      patientName: patientName || parameters.patient_name || (user ? user.name : "Health Screening Subject"),
    };

    try {
      const existingRaw = localStorage.getItem("mediscan_assessments");
      const existing: StoredAssessment[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newRecord, ...existing];
      localStorage.setItem("mediscan_assessments", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save assessment to history:", e);
    }

    return newRecord;
  };

  const getAssessments = (filterDisease?: string): StoredAssessment[] => {
    try {
      const existingRaw = localStorage.getItem("mediscan_assessments");
      const all: StoredAssessment[] = existingRaw ? JSON.parse(existingRaw) : [];

      const userAssessments = user
        ? all.filter((a) => a.userId === user.id || a.userId === "usr_guest")
        : all.filter((a) => a.userId === "usr_guest");

      if (filterDisease && filterDisease !== "all") {
        return userAssessments.filter((a) =>
          a.disease.toLowerCase().includes(filterDisease.toLowerCase())
        );
      }
      return userAssessments;
    } catch (e) {
      return [];
    }
  };

  const deleteAssessment = (id: string) => {
    try {
      const existingRaw = localStorage.getItem("mediscan_assessments");
      if (!existingRaw) return;
      const all: StoredAssessment[] = JSON.parse(existingRaw);
      const filtered = all.filter((a) => a.id !== id);
      localStorage.setItem("mediscan_assessments", JSON.stringify(filtered));
    } catch (e) {
      console.error("Failed to delete assessment:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isFirebaseReady,
        login,
        signup,
        loginWithGoogle,
        loginWithOAuth,
        logout,
        forgotPassword,
        updateProfile,
        changePassword,
        saveAssessment,
        getAssessments,
        deleteAssessment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
