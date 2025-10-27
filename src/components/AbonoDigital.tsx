"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import gevpLogo from "../../public/imagenes/escudoGevp.png";
import { viewAbonoById } from "../services/AbonosService";
import { useAuthStore } from "../store/userAuthStore";

type Abono = {
  id: number;
  nombre: string;
  dni: string;
  vence: string;
  qrCode?: string;
  asiento?: number; // ruta al PNG generado por el backend
};

export default function AbonoDigital() {
  const { id } = useParams();
  const [abono, setAbono] = useState<Abono | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    AOS.init();

    const fetchAbono = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const abonoData = await viewAbonoById(Number(id));
        console.log(abonoData);
        // Generamos la URL que tendrá el QR al escanearlo
        if (abonoData) {
          const qrUrl = `http://localhost:3000/qrStatus/${abonoData.id}`;
          setAbono({ ...abonoData, qrCode: qrUrl });
        }
      } catch (err) {
        console.error("Error al cargar el abono:", err);
        setError("No se pudo cargar el abono.");
        setAbono(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAbono();
  }, [id]);

  const formatDate = (date: string | Date) => {
    if (!date) return "";

    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0]; // yyyy-mm-dd

    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (loading) return <p className="p-6 text-center">Cargando abono...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!abono) return <p className="p-6 text-center">Abono no encontrado ❌</p>;

  return (
    <>
      <Head>
        <link rel="manifest" href={`/api/abonos/${abono.id}/manifest.json`} />
      </Head>

      <div className="flex flex-col items-center justify-start w-full h-full">
        {isLoggedIn && (
          <div className="w-full xl:flex hidden justify-center my-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-sky-700 text-white font-semibold rounded-lg shadow-md hover:bg-sky-800  transition-all cursor-pointer"
            >
              Imprimir carnet
            </button>
          </div>
        )}

        {/* Contenedor de los carnets */}
        <div className="flex flex-col gap-2 justify-center items-center print:flex print:flex-col print:gap-4 print:items-start print:justify-start">
          {/* Frente */}
          <div
            className="relative border-sky-900 border-4 rounded-2xl p-5 flex flex-col items-center justify-center gap-4 shadow-2xl
                  xl:w-[500px] w-full xl:h-[250px] h-[200px] overflow-hidden
                  print:w-[8cm] print:h-[5cm] print:shadow-none print:p-2 print:gap-2"
          >
            {/* Fondo degradado */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-sky-800 to-blue-900" />

            {/* Imagen de equipo */}
            <img
              src="/imagenes/equipo.jpg"
              alt="Equipo"
              className="absolute inset-0 w-full h-full object-cover opacity-20 print:opacity-20"
            />

            {/* Brillos */}
            <div className="absolute -top-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl" />

            {/* Contenido centrado verticalmente */}
            <div className="relative z-10 w-full flex flex-col justify-center h-full">
              <h2 className="xl:text-xl text-lg print:text-base text-white font-bold w-full text-center">
                Abono GEVP Liga Federal 2026
              </h2>

              <div className="flex flex-row justify-between gap-4 items-center mt-4 xl:w-[80%] print:w-[95%] mx-auto print:gap-3 print:flex print:items-center print:justify-center">
                <div className="flex flex-col text-white print:text-sm text-sm xl:text-xl">
                  <h2 className="font-bold">{abono.nombre}</h2>
                  <p>DNI: {abono.dni}</p>
                  <p>Válido hasta: {formatDate(abono.vence)}</p>
                  <p>№ Asiento: {abono.asiento}</p>
                </div>

                <div className="flex items-center">
                  {abono.qrCode ? (
                    <img
                      src={`http://localhost:5001/qrs/abono_${abono.id}.png`}
                      alt="QR del abono"
                      className="xl:w-28 xl:h-28 w-26 h-26 print:w-21 print:h-21"
                    />
                  ) : (
                    <p className="text-white print:text-[0.7rem]">
                      QR no generado
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Dorso */}
          {isLoggedIn && (
            <div
              className="relative border-sky-900 border-4 rounded-2xl p-5 flex flex-col items-center justify-center shadow-2xl
                  xl:w-[500px] w-full xl:h-[250px] h-[200px] overflow-hidden
                  print:w-[8cm] print:h-[5cm] print:shadow-none print:p-2"
            >
              {/* Fondo degradado + brillos */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-sky-800 to-blue-900" />
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-cyan-400/10 rounded-full blur-2xl" />

              {/* Logo difuso */}
              <Image
                src={gevpLogo}
                alt="Escudo del club"
                className="absolute opacity-20 pointer-events-none select-none w-40 h-48 print:w-28 print:h-36"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
