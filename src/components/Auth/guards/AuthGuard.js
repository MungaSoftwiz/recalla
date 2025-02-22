import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/auth/sign-in");
        setAuthenticated(false);
      } else if (event === "SIGNED_IN" && session) {
        setAuthenticated(true);
      }
    });

    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange((event, session) => {
    //   if (event === "SIGNED_OUT" || !session) {
    //     router.push("/auth/sign-in");
    //   }
    // });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#9C55FF]" />
      </div>
    );
  }

  return authenticated ? children : null;
}
