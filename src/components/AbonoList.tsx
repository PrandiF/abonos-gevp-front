"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Confirmation from "./ConfirmationModal";
import { MdSearch } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/userAuthStore";
import AccesoDenegado from "./AccesoDenegado";
import Footer from "./Footer";
import Header from "./Header";
import { deleteAbonoById, viewAbonos } from "../services/AbonosService";

type Abono = {
  id: number;
  nombre: string;
  dni: string;
  vence: string;
  qrCode: string;
};

export default function ListarAbonos() {
  const [abonos, setAbonos] = useState<Abono[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDNI, setFiltroDNI] = useState("");
  const [abonoAEliminar, setAbonoAEliminar] = useState<Abono | null>(null);
  const [copiado, setCopiado] = useState<number | null>(null);
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ once: true }); // 'once: true' evita animaciones repetidas al hacer scroll
    }

    const fetchAbonos = async () => {
      try {
        const data = await viewAbonos(); // 👈 llamamos al service real
        setAbonos(data);
      } catch (error) {
        console.error("Error cargando abonos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbonos();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  if (loading) return <p className="p-4">Cargando abonos...</p>;

  const abonosFiltrados = abonos.filter(
    (abono) =>
      abono.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
      abono.dni.includes(filtroDNI)
  );

  const handleCopiar = (id: number) => {
    navigator.clipboard.writeText(`http://localhost:3000/abonos/${id}`);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };
  const handleEliminarConfirmado = async () => {
    if (abonoAEliminar) {
      try {
        await deleteAbonoById(Number(abonoAEliminar.id)); // 👈 service de eliminación
        setAbonos((prev) => prev.filter((a) => a.id !== abonoAEliminar.id));
        setAbonoAEliminar(null);
      } catch (error) {
        console.error("Error eliminando abono:", error);
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col min-h-screen w-full relative">
          {/* Header */}
          <Header />

          {/* Contenido */}
          <main className="flex-1 flex flex-col items-center justify-start p-6 relative gap-6 w-full">
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-6 text-blue-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
              data-aos="fade"
              data-aos-duration="1200"
              data-aos-delay="300"
            >
              ← Volver
            </button>

            <div
              className="w-[99%] xl:w-[90%] mt-16 bg-white/40 backdrop-blur-sm rounded-2xl shadow-xl xl:p-6 p-2 flex flex-col gap-6"
              data-aos="fade"
              data-aos-duration="1300"
              data-aos-delay="300"
            >
              <h1 className="xl:text-3xl text-2xl font-bold text-center text-blue-900">
                Todos los Abonos
              </h1>

              {/* Barra de filtros */}
              <div className="flex gap-4 mb-4 xl:flex-row flex-col mx-4">
                <div className="relative flex-1 ">
                  <MdSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
                <div className="relative flex-1">
                  <MdSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Filtrar por DNI"
                    value={filtroDNI}
                    onChange={(e) => setFiltroDNI(e.target.value)}
                    className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              </div>

              {/* Tabla de abonos */}
              <div className="overflow-x-auto rounded-lg">
                <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-2 xl:px-4 py-2 text-left text-sm font-semibold text-blue-900">
                          Nombre
                        </th>
                        <th className="px-2 xl:px-4 py-2 text-left text-sm font-semibold text-blue-900">
                          DNI
                        </th>
                        <th className="px-2 xl:px-4 py-2 text-left text-sm font-semibold text-blue-900">
                          Vence
                        </th>
                        <th className="px-2 xl:px-4 py-2 text-left text-sm font-semibold text-blue-900 hidden xl:table-cell">
                          Abono Digital
                        </th>
                        <th className="px-2 xl:px-4 py-2 text-left text-sm font-semibold text-blue-900">
                          Acceso
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {abonosFiltrados.length > 0 ? (
                        abonosFiltrados.map((abono) => (
                          <tr
                            key={abono.id}
                            className="hover:bg-blue-50 transition"
                          >
                            <td className="px-2 xl:px-4 py-3">
                              {abono.nombre}
                            </td>
                            <td className="px-2 xl:px-4 py-3">{abono.dni}</td>
                            <td className="px-2 xl:px-4 py-3">
                              {formatDate(abono.vence)}
                            </td>
                            <td className="hidden xl:table-cell px-2 xl:px-4 py-3">
                              <Link href={`/abonos/${abono.id}`}>
                                <button className="text-blue-500 hover:underline cursor-pointer">
                                  Ver Abono Digital
                                </button>
                              </Link>
                            </td>
                            <td className="px-2 xl:px-4 py-3 flex gap-2 items-center relative">
                              <button
                                onClick={() => handleCopiar(abono.id)}
                                className="cursor-pointer xl:bg-gradient-to-r from-blue-500 to-cyan-400 xl:text-white text-blue-500 xl:px-3 xl:py-2 xl:rounded-lg text-sm font-medium xl:hover:from-blue-600 xl:hover:to-cyan-500 hover:underline transition relative flex items-center justify-center my-auto h-full"
                              >
                                Copiar
                                {copiado === abono.id && (
                                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-20 w-fit">
                                    Copiado correctamente!
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => setAbonoAEliminar(abono)}
                                className="text-red-500 hover:text-red-700 cursor-pointer absolute right-8 xl:flex hidden"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-6 text-gray-500 font-medium"
                          >
                            No existen abonos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal de confirmación */}
            {abonoAEliminar && (
              <Confirmation
                question={`¿Seguro que querés eliminar el abono de "${abonoAEliminar.nombre}"?`}
                onConfirm={handleEliminarConfirmado}
                onCancel={() => setAbonoAEliminar(null)}
              />
            )}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      ) : (
        <AccesoDenegado />
      )}
    </>
  );
}
