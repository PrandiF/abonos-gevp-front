import axios from "axios";

const API_URL = "http://localhost:5001/api/abonos"; // ajusta si tu backend usa otro prefijo

export const createAbono = async (nombre: string, dni: string, vence: Date) => {
  try {
    const res = await axios.post(
      `${API_URL}/`,
      { nombre, dni, vence },
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
    console.log("Abono:", res.data); // 👈 debería ya traer { id, nombre, dni, vence, qrCode }
    return res.data; // ✅ devolvemos directamente el abono completo
  } catch (error) {
    console.error("View Abono error:", error);
    throw error;
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
