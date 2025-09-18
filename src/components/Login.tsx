// Login.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdPerson, MdLock } from "react-icons/md";
import { loginService } from "../services/UsuarioService";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuthStore } from "../store/userAuthStore";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginService(username, password);

      // ✅ marcar como logueado en Zustand
      useAuthStore.getState().login();

      setLoading(false);
      router.push("/home"); // redirigir
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data || "Error al iniciar sesión");
    }
  };

  return (
    <div
      className=" bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-col "
      data-aos="fade"
      data-aos-duration="1200"
      data-aos-delay="300"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
        Iniciar Sesión
      </h1>

      {error && (
        <p className="mb-4 text-center text-sm text-red-500 font-semibold">
          {error}
        </p>
      )}

      <form className="flex flex-col gap-4">
        {/* Usuario */}
        <div className="relative">
          <MdPerson className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        {/* Contraseña */}
        <div className="relative">
          <MdLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        {/* Botón */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition duration-300 cursor-pointer"
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}
