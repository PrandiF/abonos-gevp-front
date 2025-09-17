"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import gevpLogo from "../../public/imagenes/escudoGevp.png";
import { viewAbonoById } from "../services/AbonosService";

type Abono = {
  id: number;
  nombre: string;
  dni: string;
  vence: string;
  qrCode?: string; // ruta al PNG generado por el backend
};

export default function AbonoDigital() {
  const { id } = useParams();
  const [abono, setAbono] = useState<Abono | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className="p-6 text-center">Cargando abono...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!abono) return <p className="p-6 text-center">Abono no encontrado ❌</p>;

  return (
    <>
      <Head>
        <link rel="manifest" href={`/api/abonos/${abono.id}/manifest.json`} />
      </Head>

      <div
        className="flex flex-col items-center xl:justify-start justify-center min-h-screen
             bg-gray-100 p-6 w-full"
      >
        <div className="border-sky-900 border-4 rounded-2xl p-5 flex flex-col items-start gap-4 shadow-xl bg-gradient-to-br from-sky-700 via-sky-800 to-blue-900 xl:w-[500px] relative">
          <h2 className="text-xl text-white font-bold w-full text-center">
            Abono GEVP Liga Federal 2026
          </h2>

          <div className="flex xl:flex-row flex-col justify-between xl:w-[70%] w-full gap-4">
            <div className="flex flex-col text-white">
              <h2 className="text-2xl  font-bold">{abono.nombre}</h2>
              <p className="xl:text-sm text-lg">DNI: {abono.dni}</p>
              <p className="xl:text-sm text-lg">Válido hasta: {abono.vence}</p>
            </div>

            <div className="flex items-center xl:justify-end">
              {abono.qrCode ? (
                <img
                  src={`http://localhost:5001/qrs/abono_${abono.id}.png`} // ruta al PNG generado
                  alt="QR del abono"
                  className="w-26 h-26"
                />
              ) : (
                <p className="text-white">QR no generado</p>
              )}
            </div>
          </div>

          {/* {abono.qrCode && (
            <a
              href={`/qr/${abono.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 text-sky-800 px-3 py-2 rounded font-semibold hover:bg-sky-900 hover:text-white transition"
            >
              Abrir QR
            </a>
          )} */}

          <Image
            src={gevpLogo}
            alt="Escudo del club"
            className="absolute -bottom-0.5 -right-1 w-36 h-42 opacity-20 pointer-events-none select-none"
          />
        </div>
      </div>
    </>
  );
}
