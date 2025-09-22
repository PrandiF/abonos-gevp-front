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
    <header className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg px-8 py-4 flex items-center relative">
      {/* Left: Desktop Menu */}
      <div className="hidden sm:flex gap-8 text-lg font-medium">
        <button
          className="relative group px-2 py-1 transition-colors duration-300 hover:text-gray-200 cursor-pointer"
          onClick={() => router.push("/home")}
        >
          Inicio
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
        </button>
        <button
          className="relative group px-2 py-1 transition-colors duration-300 hover:text-gray-200 cursor-pointer"
          onClick={() => router.push("/abonos/nuevo")}
        >
          Crear Abono
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
        </button>
        <button
          className="relative group px-2 py-1 transition-colors duration-300 hover:text-gray-200 cursor-pointer"
          onClick={() => router.push("/abonos/listar")}
        >
          Todos los Abonos
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
        </button>
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 transition-transform duration-300 hover:scale-105">
        <Image src={escudoGevp} alt="Escudo GEVP" height={54} />
      </div>

      {/* Right: Logout */}
      <div className="ml-auto flex items-center">
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-300 shadow-sm cursor-pointer"
          onClick={() => setShowConfirm(true)}
        >
          <MdLogout className="text-xl" />
          <span className="xl:flex hidden font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Mobile Hamburger remains the same */}
      <div className="flex sm:hidden items-center gap-4">
        <button
          className="text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      {/* Mobile Menu Drawer & Confirmation remain the same */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-cyan-600 text-white flex flex-col items-center py-4 gap-4 sm:hidden z-20">
          {/* botones */}
        </div>
      )}
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
