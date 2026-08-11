"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

function SuccessContent() {
  const params = useSearchParams();
  const explorerNo = params.get("id")?.trim() ?? "";

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

        // White background
        context.fillStyle = "#FFFFFF";
        context.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        // QR Code
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
     BEST OPTION FOR ANDROID + IPHONE
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
       * Try native Android/iPhone share sheet first.
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
            title: "Claver Children's Festival QR Code",
            text: `Explorer Number: ${explorerNo}`,
          });

          return;
        } catch (error) {
          /*
           * User intentionally closed the share menu.
           */
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
       * Standard browser download.
       */
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

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
        "Your browser could not save the QR Code automatically. Please use the Open QR Image button below."
      );
    }
  };

  /* =======================================================
     OPEN QR AS STANDALONE IMAGE
     ANDROID FALLBACK
  ======================================================= */

  const openQrImage = async () => {
    if (!explorerNo) {
      alert("The QR Code is not ready.");
      return;
    }

    /*
     * Open the tab immediately from the user's click.
     * This helps prevent Android browsers from treating
     * the new window as a blocked pop-up.
     */
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      alert(
        "Please allow pop-ups for this website, then try again."
      );
      return;
    }

    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preparing QR Code...</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
        </head>

        <body
          style="
            margin:0;
            display:flex;
            min-height:100vh;
            align-items:center;
            justify-content:center;
            font-family:Arial,sans-serif;
            background:#ffffff;
          "
        >
          <p>Preparing QR Code...</p>
        </body>
      </html>
    `);

    try {
      const blob = await createQrPngBlob();

      const url = URL.createObjectURL(blob);

      newWindow.document.open();

      newWindow.document.write(`
        <!DOCTYPE html>

        <html>
          <head>
            <title>${explorerNo} QR Code</title>

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />

            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                font-family: Arial, sans-serif;
                padding: 24px;
                box-sizing: border-box;
                text-align: center;
              }

              img {
                width: min(90vw, 600px);
                height: auto;
              }

              h2 {
                color: #166534;
                margin-bottom: 5px;
              }

              p {
                color: #4b5563;
                line-height: 1.5;
              }

              .instruction {
                margin-top: 20px;
                max-width: 500px;
                padding: 15px;
                background: #fefce8;
                border-radius: 12px;
              }
            </style>
          </head>

          <body>

            <h2>
              Explorer No. ${explorerNo}
            </h2>

            <p>
              Claver Children's Festival
            </p>

            <img
              src="${url}"
              alt="QR Code for ${explorerNo}"
            />

            <div class="instruction">
              <strong>Android:</strong>
              Press and hold the QR Code image,
              then select
              <strong>
                Download image
              </strong>
              or
              <strong>
                Save image
              </strong>.
            </div>

          </body>
        </html>
      `);

      newWindow.document.close();

      /*
       * Keep the Blob URL available long enough for
       * Android users to long-press/save the image.
       */
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 120000);
    } catch (error) {
      console.error(
        "Open QR image error:",
        error
      );

      newWindow.close();

      alert(
        "Unable to open the QR Code image. Please take a screenshot of the QR Code."
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

        {/* SAVE / SHARE */}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <button
            type="button"
            onClick={saveOrShareQr}
            disabled={!explorerNo}
            className="w-full rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
          >
            📥 Save / Share QR Code
          </button>

          <button
            type="button"
            onClick={openQrImage}
            disabled={!explorerNo}
            className="w-full rounded-full border-2 border-green-700 bg-white px-8 py-4 font-bold text-green-800 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 sm:w-auto"
          >
            🖼 Open QR Image
          </button>

        </div>

        {/* ANDROID HELP */}

        <div className="mx-auto mt-6 max-w-lg rounded-2xl bg-yellow-50 p-4 text-sm text-gray-600">

          <p className="font-bold text-green-800">
            Android users
          </p>

          <p className="mt-1">
            If Save / Share does not save the QR Code,
            tap <strong>Open QR Image</strong>.
            Press and hold the image, then choose
            <strong> Download image</strong> or
            <strong> Save image</strong>.
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