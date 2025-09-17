"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react"; // Importación corregida
import { viewAbonoById } from "../services/AbonosService";

type Abono = {
  id: number;
  nombre: string;
};

export default function QRViewer({ id }: { id: string }) {
  const [abono, setAbono] = useState<Abono | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbono = async () => {
      try {
        const res = await viewAbonoById(Number(id));
        setAbono(res.data); // Suponiendo que tu API devuelve el abono en res.data
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el QR.");
      } finally {
        setLoading(false);
      }
    };
    fetchAbono();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando QR...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!abono)
    return <p className="text-center mt-10">Abono no encontrado ❌</p>;

  const qrUrl = `http://localhost:3000/qrStatus/${abono.id}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <h2 className="text-2xl font-bold">{abono.nombre}</h2>
      <QRCodeSVG value={qrUrl} size={320} />
      <p className="text-gray-600">
        Escaneá el QR para ver el estado del abono
      </p>
    </div>
  );
}
