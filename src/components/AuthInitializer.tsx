"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/userAuthStore";
import { checkAuthService } from "../services/UsuarioService";

export default function AuthInitializer() {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Llamamos al service que ya maneja 401 internamente
        const res = await checkAuthService();

        if (res.loggedIn) {
          login(); // actualiza isLoggedIn: true
        } else {
          logout(); // actualiza isLoggedIn: false
        }
      } catch (err) {
        // cualquier error inesperado también se maneja
        logout();
      }
    };

    void initAuth(); // usamos void para evitar warning de Promise sin catch
  }, [login, logout]);

  return null; // no renderiza nada, solo inicializa auth
}
