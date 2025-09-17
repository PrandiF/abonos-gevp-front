"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuthStore } from "../store/userAuthStore";
import AccesoDenegado from "./AccesoDenegado";
import Header from "./Header";
import Footer from "./Footer";

export default function Inicio() {
  const router = useRouter();

  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ once: true }); // 'once: true' evita animaciones repetidas al hacer scroll
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col min-h-screen w-full">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-start gap-8 flex-grow w-full p-6">
            <h1
              className="text-3xl font-bold text-center text-blue-900"
              data-aos="fade"
              data-aos-duration="1200"
            >
              Panel de Abonos
            </h1>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="200"
            >
              <Link href="/abonos/nuevo" className="group">
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 mb-4 text-blue-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.688-1.688a1.875 1.875 0 112.652 2.652l-9.9 9.9a4.5 4.5 0 01-1.897 1.13l-3.372.96a.75.75 0 01-.927-.927l.96-3.372a4.5 4.5 0 011.13-1.897l9.666-9.758z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 7.125L16.862 4.487"
                    />
                  </svg>
                  <span className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    Crear Abono
                  </span>
                </div>
              </Link>
              <Link href="/abonos/listar" className="group">
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 mb-4 text-blue-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.008v.008H3.75V6.75zm0 5.25h.008v.008H3.75V12zm0 5.25h.008v.008H3.75v-.008z"
                    />
                  </svg>
                  <span className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    Ver Abonos
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <AccesoDenegado />
      )}
    </>
  );
}
