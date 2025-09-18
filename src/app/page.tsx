"use client";

import Head from "next/head";
import Login from "../components/Login";
import { useAuthStore } from "../store/userAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home"); // si ya está logueado
    } else {
      router.replace("/"); // si no está logueado
    }
  }, [isLoggedIn, router]);
  return (
    <div className="w-[30%]">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Login />
    </div>
  );
}
