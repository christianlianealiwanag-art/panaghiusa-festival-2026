"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

function SuccessContent() {
  const params = useSearchParams();
  const explorerNo = params.get("id")?.trim() ?? "";

  const [isFacebookBrowser, setIsFacebookBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || "";

    const isFacebook =
      /FBAN|FBAV|Messenger|Instagram/i.test(userAgent);

    setIsFacebookBrowser(isFacebook);
  }, []);

  /* =======================================================
     CREATE QR CODE AS PNG
  ======================================================= */

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
        const qrSize = 700;
        const padding = 70;

        const canvas = document.createElement("canvas");

        canvas.width = qrSize + padding * 2;
        canvas.height = qrSize + padding * 2;

        const context = canvas.getContext("2d");

        if (!context) {
          URL.revokeObjectURL(svgUrl);
          reject(new Error("Unable to create QR image."));
          return;
        }

        context.fillStyle = "#FFFFFF";
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
                  "Unable to create QR Code PNG."
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

  /* =======================================================
     SAVE / SHARE QR CODE
  ======================================================= */

  const saveOrShareQr = async () => {
    if (!explorerNo) {
      alert("The QR Code is not ready.");
      return;
    }

    try {
      const blob = await createQrPngBlob();

      const fileName = `${explorerNo}-QR.png`;

      const file = new File(
        [blob],
        fileName,
        {
          type: "image/png",
        }
      );

      /*
       * MOBILE:
       * Try native share sheet first.
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
            title:
              "Claver Children's Festival QR Code",
            text: `Explorer Number: ${explorerNo}`,
          });

          return;
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.warn(
            "Native sharing failed.",
            error
          );
        }
      }

      /*
       * FALLBACK:
       * Normal PNG download.
       */
      const url = URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;
      anchor.download = fileName;
      anchor.style.display = "none";

      document.body.appendChild(anchor);

      anchor.click();

      document.body.removeChild(anchor);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
    } catch (error) {
      console.error(
        "QR save/share error:",
        error
      );

      alert(
        "Unable to save the QR Code automatically. Please take a screenshot of the QR Code."
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

        {/* FACEBOOK / MESSENGER NOTICE */}

        {isFacebookBrowser && (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left">

            <p className="font-bold text-blue-900">
              📱 Using Messenger or Facebook?
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              For easier QR saving on Android, tap the
              <strong> ⋯ </strong>
              menu at the top-right of your browser,
              then choose
              <strong> Open in Chrome </strong>
              or
              <strong> Open in Browser</strong>.
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              After opening in Chrome, tap
              <strong> Save / Share QR Code</strong>.
            </p>

          </div>
        )}

        {/* EXPLORER NUMBER */}

        <div className="mt-8 rounded-2xl bg-yellow-50 p-6">

          <p className="text-lg text-gray-500">
            Your Explorer Number
          </p>

          <h2 className="mt-3 break-words text-3xl font-black text-green-800 md:text-5xl">
            {explorerNo || "Not Available"}
          </h2>

        </div>

        {/* QR CODE */}

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

            Explorer Number was not found.
            Please return to registration.

          </div>
        )}

        {/* INSTRUCTIONS */}

        <div className="mt-8 space-y-2">

          <p className="font-bold text-green-800">
            Present this QR Code
          </p>

          <p className="text-gray-600">
            The volunteer will scan it and confirm
            the child&apos;s arrival.
          </p>

        </div>

        {/* SAVE BUTTON */}

        <div className="mt-10 flex justify-center">

          <button
            type="button"
            onClick={saveOrShareQr}
            disabled={!explorerNo}
            className="w-full rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
          >
            📥 Save / Share QR Code
          </button>

        </div>

        {/* FALLBACK */}

        <div className="mx-auto mt-6 max-w-lg rounded-2xl bg-yellow-50 p-4 text-sm text-gray-600">

          <p className="font-bold text-green-800">
            If the QR Code will not save
          </p>

          <p className="mt-1">
            Please take a screenshot of this page.
            Make sure the QR Code and Explorer Number
            are clearly visible.
          </p>

        </div>

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