"use client";
import { useParams } from "next/navigation";
import QrViewer from "../../../components/QrViewer";

export default function QRPage() {
  const { id } = useParams(); // ✅ ahora id viene directo
  if (!id) return <p>ID no encontrado</p>;
  return <QrViewer id={Array.isArray(id) ? id[0] : id} />;
}
