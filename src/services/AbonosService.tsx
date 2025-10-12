import axios from "axios";

const API_URL = "http://localhost:5001/api/abonos"; // ajusta si tu backend usa otro prefijo

export const createAbono = async (
  nombre: string,
  dni: string,
  vence: string,
  asiento: number | string
) => {
  try {
    const res = await axios.post(
      `${API_URL}/`,
      { nombre, dni, vence, asiento },
      { withCredentials: true }
    );

    console.log("Create Abono res.data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Create Abono error:", error);
    throw error;
  }
};

export const viewAbonos = async () => {
  try {
    const res = await axios.get(`${API_URL}/`, { withCredentials: true });
    console.log("Abonos:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("View Abonos error:", error);
    throw error;
  }
};

export const viewAbonoById = async (id: number) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
    console.log("Abono:", res.data); // 👈 ver qué trae realmente
    return res.data || null; // ✅ nunca undefined
  } catch (error) {
    console.error("View Abono error:", error);
    return null; // si falla, devolvemos null
  }
};
export const deleteAbonoById = async (id: number) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });

    console.log("Abono eliminado:", res.data);
    return res.data;
  } catch (error) {
    console.error("Delete Abono error:", error);
    throw error;
  }
};

type FilterProps = {
  nombre: string;
  dni: string;
};
export const getFilterAbono = async (filter: FilterProps) => {
  let filterClean: FilterProps = {
    nombre: filter.nombre,
    dni: filter.dni,
  };

  let stringReq = "";
  Object.keys(filterClean).forEach((key) => {
    if (filterClean[key as keyof FilterProps]) {
      if (stringReq) {
        stringReq += `&${key}=${filterClean[key as keyof FilterProps]}`;
      } else {
        stringReq += `?${key}=${filterClean[key as keyof FilterProps]}`;
      }
    }
  });

  try {
    const res = await axios.get(`${API_URL}/filter${stringReq}`, {
      withCredentials: true,
    });
    return res.data.data;
  } catch (error) {
    console.error("Error al filtrar el/los abono/s:", error);
    throw error;
  }
};

// Obtiene los asientos ocupados para una fecha específica
export const getAsientosOcupados = async (vence: string) => {
  if (!vence) return []; // no llamar al backend si no hay fecha

  try {
    console.log("Enviando fecha:", vence);
    const res = await axios.get(`${API_URL}/asientos-ocupados`, {
      params: { vence },
      withCredentials: true,
    });

    // verificar que sea un array de números
    if (!Array.isArray(res.data)) {
      console.error("Respuesta inesperada:", res.data);
      return [];
    }

    const asientos: number[] = res.data.map((a: any) => Number(a));
    console.log("Asientos ocupados:", asientos);
    return asientos;
  } catch (error: any) {
    console.error("Error al obtener asientos ocupados (detalle):", error);
    if (error.response) {
      console.error("📡 Error de respuesta:", error.response.data);
    } else if (error.request) {
      console.error("🚫 No hubo respuesta del servidor:", error.request);
    } else {
      console.error("⚙️ Error al preparar la solicitud:", error.message);
    }
    throw error; // para que el frontend no se rompa
  }
};
