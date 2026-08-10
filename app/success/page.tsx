"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

export default function SuccessPage() {
  const params = useSearchParams();
  const explorerNo = params.get("id")?.trim() ?? "";

  const downloadQr = () => {
    const svg = document.getElementById(
      "explorer-qr-code"
    ) as SVGSVGElement | null;

    if (!svg || !explorerNo) {
      alert("The QR Code is not ready.");
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const svgWithHeader = source.includes("xmlns=")
      ? source
      : source.replace(
          "<svg",
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );

    const blob = new Blob([svgWithHeader], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = `${explorerNo}-QR.svg`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-yellow-400 p-5 md:p-8">
      <section
        id="registration-confirmation"
        className="w-full max-w-xl rounded-3xl bg-white p-7 text-center shadow-2xl md:p-10"
      >
        <div className="text-6xl">🦁</div>

        <h1 className="mt-3 text-3xl font-black text-green-800 md:text-4xl">
          Registration Successful!
        </h1>

        <p className="mt-3 text-gray-600">
          Save this QR Code and present it to the registration volunteers
          upon arrival.
        </p>

        <div className="mt-8 rounded-2xl bg-yellow-50 p-6">
          <p className="text-lg text-gray-500">
            Your Explorer Number
          </p>

          <h2 className="mt-3 break-words text-3xl font-black text-green-800 md:text-5xl">
            {explorerNo || "Not Available"}
          </h2>
        </div>

        {explorerNo ? (
          <div className="mt-8 inline-block rounded-2xl bg-white p-6 shadow-xl">
            <QRCode
              id="explorer-qr-code"
              value={explorerNo}
              size={220}
              level="H"
              title={`QR Code for ${explorerNo}`}
            />
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-red-50 p-6 text-red-700">
            Explorer Number was not found. Please return to registration.
          </div>
        )}

        <div className="mt-8 space-y-2">
          <p className="font-bold text-green-800">
            Present this QR Code
          </p>

          <p className="text-gray-600">
            The volunteer will scan it and confirm the child’s arrival.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!explorerNo}
            className="rounded-full bg-yellow-400 px-7 py-3 font-bold text-green-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            🖨 Print
          </button>

          <button
            type="button"
            onClick={downloadQr}
            disabled={!explorerNo}
            className="rounded-full bg-green-700 px-7 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            📥 Download QR
          </button>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block font-semibold text-green-700 underline print:hidden"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}
<Link
  href="/festival-map"
  className="flex items-center justify-center rounded-full bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
>
  🗺️ View Festival Map
</Link>