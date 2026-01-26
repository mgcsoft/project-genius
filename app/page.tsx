"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Fallback redirect if rewrite doesn't work
    router.replace("/wandelroute");
  }, [router]);

  return null;
}
