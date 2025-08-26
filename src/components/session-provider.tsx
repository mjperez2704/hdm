
"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

// Simulación de un objeto de usuario
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signOut: () => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

const FAKE_USER: User = {
  uid: 'fake-user-id',
  email: 'admin@example.com',
  displayName: 'Admin User',
  photoURL: '',
};

const PROTECTED_ROUTES = [
    "/dashboard", 
    "/users", 
    "/roles", 
    "/catalogs", 
    "/customers", 
    "/providers", 
    "/sales",
    "/purchases",
    "/repairs",
    "/inventory",
    "/warehouse",
    "/transfers",
    "/adjustments",
    "/employees",
    "/vendedores",
    "/billing",
    "/finances",
    "/crm",
    "/reports",
    "/internal",
    "/settings"
];

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simular la carga inicial de la sesión
    const session = sessionStorage.getItem("app-session");
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    
    if (!user && isProtectedRoute) {
        router.push('/login');
    }

    if (user && pathname === '/login') {
        router.push('/dashboard');
    }

  }, [user, loading, pathname, router]);

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    if (email === "admin@example.com" && pass === "password123") {
      sessionStorage.setItem("app-session", JSON.stringify(FAKE_USER));
      setUser(FAKE_USER);
      return true;
    }
    return false;
  };

  const signOut = () => {
    sessionStorage.removeItem("app-session");
    setUser(null);
    router.push("/login");
  };

  const value = { user, loading, signIn, signOut };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (context === undefined) {
      throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};
