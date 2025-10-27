"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MdArrowBack,
  MdCreditCard,
  MdDateRange,
  MdPerson,
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuthStore } from "../store/userAuthStore";
import AccesoDenegado from "./AccesoDenegado";
import Header from "./Header";
import Footer from "./Footer";
import { createAbono, getAsientosOcupados } from "../services/AbonosService";
import SeatSelectorModal from "./ModalSelectorAsientos";

export default function NuevoAbono() {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [vence, setVence] = useState(""); // sigue siendo string "yyyy-mm-dd"
  const [mensaje, setMensaje] = useState("");
  const [asiento, setAsiento] = useState<number | "">("");
  const [asientosDisponibles, setAsientosDisponibles] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ once: true });
    }
  }, []);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  useEffect(() => {
    const fetchAsientos = async () => {
      if (!vence) return;

      const ocupados = await getAsientosOcupados(vence);
      const disponibles = Array.from({ length: 300 }, (_, i) => i + 1).filter(
        (num) => !ocupados.includes(num)
      );

      setAsientosDisponibles(disponibles);
      setAsiento(""); // reset si cambia la fecha
    };

    fetchAsientos();
  }, [vence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    try {
      // 👈 enviamos vencimiento como string directamente
      const res = await createAbono(nombre, dni, vence, asiento);
      setMensaje("Abono creado correctamente ✅");
      setNombre("");
      setDni("");
      setVence("");
      setAsiento("");
      console.log("Abono creado:", res);
    } catch (err) {
      console.error(err);
      setMensaje("Error al crear el abono ❌");
    }
  };

  // Función helper para mostrar fechas en dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col h-screen w-full ">
          <Header />

          <main className="flex-1 flex flex-col items-center justify-start gap-8 p-6 relative">
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md text-cyan-600 cursor-pointer font-medium rounded-lg shadow-sm hover:scale-105 transition-all duration-700 ease-in-out"
              data-aos="fade"
              data-aos-duration="1200"
              data-aos-delay="300"
            >
              <MdArrowBack className="text-lg" />
              Volver
            </button>

            <div
              className="w-full max-w-md bg-white/40 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-col mt-16"
              data-aos="fade-in"
              data-aos-duration="1300"
              data-aos-delay="300"
            >
              <h1 className="xl:text-3xl text-2xl font-bold mb-6 text-center text-blue-900">
                Crear Abono
              </h1>

              {mensaje && (
                <p className="mb-4 text-center text-sm text-gray-700 font-medium">
                  {mensaje}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <MdPerson className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Nombre y Apellido"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                </div>

                <div className="relative">
                  <MdCreditCard className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                </div>

                <div className="relative">
                  <MdDateRange className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type={vence ? "date" : "text"}
                    placeholder="Fecha de vencimiento"
                    value={vence}
                    onChange={(e) => setVence(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!vence) e.target.type = "text";
                    }}
                    className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                </div>
                <div className="relative">
                  <select
                    value={asiento}
                    onChange={(e) => setAsiento(Number(e.target.value))}
                    className="xl:hidden w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    disabled={!vence}
                  >
                    <option value="">-- Seleccionar asiento --</option>
                    {asientosDisponibles.map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => vence && setModalOpen(true)}
                    disabled={!vence}
                    className={`hidden xl:flex w-full p-3 border border-gray-300 rounded-lg text-left transition ${
                      vence
                        ? "hover:ring-2 hover:ring-blue-400 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {asiento ? `Asiento ${asiento}` : "Seleccionar asiento"}
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition duration-300 cursor-pointer"
                >
                  Crear Abono
                </button>

                <SeatSelectorModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onSelect={(num) => setAsiento(num)}
                  fecha={vence}
                  getAsientosOcupados={getAsientosOcupados}
                />
              </form>
            </div>
          </main>

          <Footer />
        </div>
      ) : (
        <AccesoDenegado />
      )}
    </>
  );
}
