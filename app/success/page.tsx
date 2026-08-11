"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

function SuccessContent() {
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
    let source = serializer.serializeToString(svg);

    if (!source.includes("xmlns=")) {
      source = source.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }

    const svgBlob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    const image = new Image();

    image.onload = () => {
      const padding = 40;
      const qrSize = 500;

      const canvas = document.createElement("canvas");
      canvas.width = qrSize + padding * 2;
      canvas.height = qrSize + padding * 2;

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(svgUrl);
        alert("Unable to prepare the QR Code for download.");
        return;
      }

      // White background
      context.fillStyle = "#ffffff";
      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.drawImage(
        image,
        padding,
        padding,
        qrSize,
        qrSize
      );

      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Unable to download the QR Code.");
          return;
        }

        const pngUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = pngUrl;
        downloadLink.download = `${explorerNo}-QR.png`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        setTimeout(() => {
          URL.revokeObjectURL(pngUrl);
        }, 1000);
      }, "image/png");
    };

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      alert("Unable to prepare the QR Code for download.");
    };

    image.src = svgUrl;
  };

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="text-6xl">
          🦁
        </div>

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
              bgColor="#FFFFFF"
              fgColor="#000000"
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
            The volunteer will scan it and confirm the child&apos;s arrival.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={downloadQr}
            disabled={!explorerNo}
            className="rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            📥 Download QR Code
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          The QR Code will be saved as a PNG image.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block font-semibold text-green-700 underline"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-green-50 px-4 py-10">
          <div className="text-center text-green-800">
            Loading registration details...
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}