"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { viewAbonoById } from "../services/AbonosService";

type Abono = {
  id: number;
  nombre: string;
  dni: string;
  vence: string;
  qrCode?: string;
};

export default function QrStatus() {
  const { id } = useParams(); // ✅ Igual que en AbonoDigital
  const [abono, setAbono] = useState<Abono | null>(null);
  const [esValido, setEsValido] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbono = async () => {
      if (!id) {
        setError("ID del abono no válido");
        setLoading(false);
        return;
      }

      try {
        const data = await viewAbonoById(Number(id));

        if (!data || !data.vence) {
          setError("Abono no encontrado o inválido.");
          return;
        }

        setAbono(data);

        const hoy = new Date();
        const fechaVencimiento = new Date(data.vence);
        setEsValido(hoy <= fechaVencimiento);
      } catch (err) {
        console.error("Error cargando abono:", err);
        setError("No se pudo cargar el abono.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbono();
  }, [id]);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!abono) return <p className="text-center">Abono no encontrado ❌</p>;

  return (
    <div className="flex xl:py-8 xl:items-center items-start justify-center min-h-screen bg-gray-100 w-full">
      <div
        className={`p-8 rounded-2xl shadow-lg text-center w-[350px]  ${
          esValido
            ? "bg-green-100 border-2 border-green-500"
            : "bg-red-100 border-2 border-red-500"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-2 ${
            esValido ? "text-green-700" : "text-red-700"
          }`}
        >
          {esValido ? "✅ Abono válido" : "❌ Abono inválido"}
        </h2>
        <p className="text-lg font-medium">{abono.nombre}</p>
        <p className="text-sm text-gray-600">
          {esValido
            ? `Vence: ${new Date(abono.vence).toLocaleDateString("es-AR")}`
            : `Venció: ${new Date(abono.vence).toLocaleDateString("es-AR")}`}
        </p>
      </div>
    </div>
  );
}
