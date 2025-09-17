"use client";

import React from "react";

interface ConfirmationProps {
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  question,
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      style={{ zIndex: 9999 }}
      className="absolute inset-0 flex items-center justify-center  backdrop-blur-sm bg-[#000000af] h-screen"
    >
      <div
        style={{ zIndex: 9999 }}
        className="bg-[#576280] flex flex-col items-center justify-center gap-10 w-[90%] max-w-lg h-[50%] rounded-lg p-8 border text-white font-bold text-2xl"
      >
        <h3 className="text-center">{question}</h3>
        <div className="flex gap-8">
          <button
            onClick={onConfirm}
            className="w-[150px] h-[60px] bg-green-500 hover:bg-green-700 text-white rounded-lg shadow-md transition cursor-pointer"
          >
            Aceptar
          </button>
          <button
            onClick={onCancel}
            className="w-[150px] h-[60px] bg-red-500 hover:bg-red-700 text-white rounded-lg shadow-md transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
