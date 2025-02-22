import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial session
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/auth/sign-in");
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/sign-in");
        setAuthenticated(false);
      } else if (event === "SIGNED_IN" && session) {
        setAuthenticated(true);
      }
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <Loader2 />;
  }

  return authenticated ? children : null;
}
