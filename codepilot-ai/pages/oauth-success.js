import { useRouter } from "next/router";
import { useEffect } from "react";

export default function OAuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;

    if (token) {
      localStorage.setItem("token", token);
      router.push("/dashboard");
    }
  }, [router.query]);

  return <p>Logging you in...</p>;
}