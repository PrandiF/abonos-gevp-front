"use client";

import QrStatus from "../../../components/QRStatus";

type Props = {
  params: { id: string };
};

export default function QrStatusPage({ params }: Props) {
  return <QrStatus id={params.id} />;
}
