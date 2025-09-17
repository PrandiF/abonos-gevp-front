import axios from "axios";

const USER_URL = `http://localhost:5001/api/usuario`;

export const loginService = async (username: string, password: string) => {
  try {
    const res = await axios.post(
      `${USER_URL}/login`,
      { username, password },
      { withCredentials: true }
    );

    console.log("Login res.data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
export const logoutService = async () => {
  try {
    const res = await axios.post(
      `${USER_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// services/UsuarioService.ts
export const checkAuthService = async () => {
  try {
    const res = await axios.get(`${USER_URL}/check-auth`, {
      withCredentials: true, // manda la cookie
    });
    return res.data; // { loggedIn: true, user: ... }
  } catch (error: any) {
    // manejamos el 401 silenciosamente
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return { loggedIn: false }; // simplemente retornamos false
    }

    // otros errores sí podemos loguearlos, pero no bloquean
    console.error("checkAuthService unexpected error:", error);
    return { loggedIn: false };
  }
};
