"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image"; // ✅ para usar imágenes de Next
import canchaDeBasquet from "../../public/imagenes/canchaDeBasquet.jpg";

type Seat = {
  numero: number;
  ocupado: boolean;
};

interface SeatSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asiento: number) => void;
  fecha: string;
  getAsientosOcupados: (fecha: string) => Promise<number[]>;
}

const ModalSelectorAsientos: React.FC<SeatSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  fecha,
  getAsientosOcupados,
}) => {
  const [asientos, setAsientos] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const fetchAsientos = async () => {
      if (!fecha) return;

      try {
        const ocupados = await getAsientosOcupados(fecha);
        const ocupadosNumeros = ocupados.map(Number);

        const arrayAsientos: Seat[] = Array.from({ length: 146 }, (_, i) => ({
          numero: i + 1,
          ocupado: ocupadosNumeros.includes(i + 1),
        }));

        setAsientos(arrayAsientos);
        setSelected(null);
      } catch (err) {
        console.error("Error fetching asientos:", err);
      }
    };

    fetchAsientos();
  }, [fecha]);

  const handleSelect = (num: number) => {
    const asiento = asientos.find((a) => a.numero === num);
    if (!asiento || asiento.ocupado) return;
    setSelected(num);
  };

  const handleConfirm = () => {
    if (selected !== null) {
      onSelect(selected);
      onClose();
    }
  };

  const filas = [
    asientos.slice(0, 49),
    asientos.slice(49, 98),
    asientos.slice(98, 146),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Selector de Asientos"
      className="bg-white p-6 rounded-xl max-w-6xl mx-auto mt-6 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
      ariaHideApp={false}
    >
      <h2 className="text-xl font-bold mb-6 text-center text-blue-800">
        Selecciona tu asiento
      </h2>

      {/* ✅ Cancha con imagen */}
      <div className="relative mx-auto mb-6 w-full max-w-5xl h-80 rounded-lg overflow-hidden border-4 border-black shadow-inner">
        <Image
          src={canchaDeBasquet} // 👉 poné tu imagen en /public/
          alt="Cancha de básquet"
          fill
          className=""
          priority
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded">
          Cancha de Básquet
        </div>
      </div>

      {/* Asientos */}
      <div className="flex flex-col gap-4">
        {filas.map((fila, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-1 flex-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 py-1"
          >
            {fila.map((a) => (
              <button
                key={a.numero}
                onClick={() => handleSelect(a.numero)}
                disabled={a.ocupado}
                className={`cursor-pointer w-8 h-8 rounded text-[10px] font-semibold transition-colors flex items-center justify-center border ${
                  a.ocupado
                    ? "bg-red-400 border-gray-500 cursor-not-allowed text-white"
                    : selected === a.numero
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-green-400 hover:bg-green-500 text-white border-green-600"
                }`}
                title={`Asiento ${a.numero}`}
              >
                {a.numero}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          className={`px-4 py-2 rounded text-white ${
            selected
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          } transition`}
        >
          Continuar
        </button>
      </div>
    </Modal>
  );
};

export default ModalSelectorAsientos;
