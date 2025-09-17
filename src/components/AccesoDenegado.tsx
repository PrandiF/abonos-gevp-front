"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function AccesoDenegado() {
  const router = useRouter();
  const [counter, setCounter] = useState(5); // 5 segundos

  useEffect(() => {
    if (counter === 0) {
      router.push("/"); // redirige automáticamente
      return;
    }

    const timer = setTimeout(() => setCounter(counter - 1), 1000);

    return () => clearTimeout(timer); // limpiar timeout al desmontar
  }, [counter, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso denegado</h1>
      <p className="text-gray-700 mb-6">
        Lo sentimos, necesitas iniciar sesión para acceder a esta página.
      </p>
      <p className="text-blue-500 font-semibold text-lg">
        Redirigiendo a iniciar sesión en:
      </p>
      <p className="text-2xl">{counter}</p>
    </div>
  );
}
