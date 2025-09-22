"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 flex flex-col sm:flex-row items-center gap-4 shadow-md justify-center">
      {/* Texto */}
      <p className="text-sm sm:text-base font-medium">
        © 2025 Abonos GEVP. Todos los derechos reservados.
      </p>

      {/* Redes Sociales */}
    </footer>
  );
}

export default Footer;
