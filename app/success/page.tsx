"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

function SuccessContent() {
  const params = useSearchParams();
  const explorerNo = params.get("id")?.trim() ?? "";

  const createQrPngBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const svg = document.getElementById(
        "explorer-qr-code"
      ) as SVGSVGElement | null;

      if (!svg || !explorerNo) {
        reject(new Error("QR Code is not ready."));
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
        const padding = 50;
        const qrSize = 600;

        const canvas = document.createElement("canvas");

        canvas.width = qrSize + padding * 2;
        canvas.height = qrSize + padding * 2;

        const context = canvas.getContext("2d");

        if (!context) {
          URL.revokeObjectURL(svgUrl);
          reject(new Error("Unable to create QR image."));
          return;
        }

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

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error(
                  "Unable to prepare QR Code for saving."
                )
              );
              return;
            }

            resolve(blob);
          },
          "image/png",
          1
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(svgUrl);

        reject(
          new Error(
            "Unable to prepare QR Code image."
          )
        );
      };

      image.src = svgUrl;
    });
  };

  const saveOrShareQr = async () => {
    if (!explorerNo) {
      alert("The QR Code is not ready.");
      return;
    }

    try {
      const blob = await createQrPngBlob();

      const file = new File(
        [blob],
        `${explorerNo}-QR.png`,
        {
          type: "image/png",
        }
      );

      /*
       * Mobile phones:
       * Use the native Share / Save interface when
       * file sharing is supported.
       */
      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({
          files: [file],
        })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: `Explorer QR Code - ${explorerNo}`,
            text: `Claver Children's Festival Explorer Number: ${explorerNo}`,
          });

          return;
        } catch (shareError) {
          /*
           * If the user simply closes the Share sheet,
           * don't show an unnecessary error message.
           */
          if (
            shareError instanceof DOMException &&
            shareError.name === "AbortError"
          ) {
            return;
          }

          console.warn(
            "Native sharing failed. Falling back to download.",
            shareError
          );
        }
      }

      /*
       * Desktop / unsupported mobile browsers:
       * Fall back to normal PNG download.
       */
      const pngUrl = URL.createObjectURL(blob);

      const downloadLink =
        document.createElement("a");

      downloadLink.href = pngUrl;
      downloadLink.download =
        `${explorerNo}-QR.png`;

      document.body.appendChild(downloadLink);

      downloadLink.click();
      downloadLink.remove();

      setTimeout(() => {
        URL.revokeObjectURL(pngUrl);
      }, 1500);
    } catch (error) {
      console.error(
        "QR save/share error:",
        error
      );

      alert(
        "Unable to save the QR Code. Please take a screenshot of the QR Code instead."
      );
    }
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
          Save this QR Code and present it to the
          registration volunteers upon arrival.
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
            Explorer Number was not found. Please
            return to registration.
          </div>
        )}

        <div className="mt-8 space-y-2">
          <p className="font-bold text-green-800">
            Present this QR Code
          </p>

          <p className="text-gray-600">
            The volunteer will scan it and confirm
            the child&apos;s arrival.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={saveOrShareQr}
            disabled={!explorerNo}
            className="rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            📥 Save / Share QR Code
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          On mobile, choose Save Image, Files, Photos,
          Gallery, or another available option from
          your phone&apos;s share menu.
        </p>

        <p className="mt-2 text-xs text-gray-400">
          If saving is unavailable, you may also take
          a screenshot of the QR Code.
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