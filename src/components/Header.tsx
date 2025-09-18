"use client";

import React, { useState } from "react";
import { MdLogout, MdMenu, MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import Confirmation from "./ConfirmationModal";
import escudoGevp from "../../public/imagenes/escudoGevp.png";
import Image from "next/image";
import { useAuthStore } from "../store/userAuthStore";
import { logoutService } from "../services/UsuarioService";

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setShowConfirm(false);

    try {
      await logoutService();
    } catch (e) {
      console.error("Logout error:", e);
    }

    useAuthStore.getState().logout();
    router.push("/");
  };

  return (
    <header className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md px-5 sm:px-8 py-4 flex items-center relative">
      {/* Left: Mobile Hamburger / Desktop Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <MdClose /> : <MdMenu />}
        </button>

        {/* Desktop Menu (oculto en mobile) */}
        <div className="hidden sm:flex gap-6 text-lg">
          <button
            className="hover:underline"
            onClick={() => router.push("/home")}
          >
            Inicio
          </button>
          <button
            className="hover:underline"
            onClick={() => router.push("/abonos/nuevo")}
          >
            Crear Abono
          </button>
          <button
            className="hover:underline"
            onClick={() => router.push("/abonos/listar")}
          >
            Todos los Abonos
          </button>
        </div>
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2  xl:top-1 -translate-x-1/2">
        <Image src={escudoGevp} alt="Escudo GEVP" height={54} />
      </div>

      {/* Right: Logout */}
      <div className="ml-auto flex items-center">
        <button
          className="flex items-center gap-1 hover:text-gray-200 transition"
          onClick={() => setShowConfirm(true)}
        >
          <MdLogout className="text-2xl" />
          <span className="xl:flex hidden ">Cerrar Sesión</span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-cyan-600 text-white flex flex-col items-center py-4 gap-4 sm:hidden z-20">
          <button
            className="hover:underline"
            onClick={() => {
              router.push("/home");
              setMenuOpen(false);
            }}
          >
            Inicio
          </button>
          <button
            className="hover:underline"
            onClick={() => {
              router.push("/abonos/nuevo");
              setMenuOpen(false);
            }}
          >
            Crear Abono
          </button>
          <button
            className="hover:underline"
            onClick={() => {
              router.push("/abonos/listar");
              setMenuOpen(false);
            }}
          >
            Todos los Abonos
          </button>
        </div>
      )}

      {/* Logout Confirmation */}
      {showConfirm && (
        <Confirmation
          question={`¿Seguro que querés cerrar sesión?`}
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </header>
  );
};

export default Header;
