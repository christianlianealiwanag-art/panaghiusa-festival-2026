"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Html5Qrcode } from "html5-qrcode";

import {
  FaCamera,
  FaCameraRotate,
  FaStop,
} from "react-icons/fa6";

type QRScannerProps = {
  onScan: (value: string) => void;
  disabled?: boolean;
};

/*
 * Fixed element id for the container the html5-qrcode
 * library renders its own <video> and scan overlay into.
 */
const QR_READER_ELEMENT_ID = "qr-reader-region";

export default function QRScanner({
  onScan,
  disabled = false,
}: QRScannerProps) {
  const scannerRef =
    useRef<Html5Qrcode | null>(null);

  const startingRef =
    useRef(false);

  const [cameraStarted, setCameraStarted] =
    useState(false);

  const [starting, setStarting] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [scanAttempts, setScanAttempts] =
    useState(0);

  const [videoDebugInfo, setVideoDebugInfo] =
    useState("");

  const [cameraFacingMode, setCameraFacingMode] =
    useState<"environment" | "user">(
      "environment"
    );

  /*
   * html5-qrcode works on both Android (Chrome)
   * and iOS (Safari), unlike the native
   * BarcodeDetector API which iOS does not
   * support. It decodes frames from a canvas,
   * so it works anywhere getUserMedia works.
   */

  function getScanner() {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(
        QR_READER_ELEMENT_ID,
        {
          verbose: false,
          /*
           * Some iOS Safari versions expose a
           * native BarcodeDetector that html5-qrcode
           * would otherwise prefer, but it's
           * unreliable for QR codes on iOS and can
           * silently never report a successful scan.
           * Forcing the built-in JS decoder keeps
           * scanning consistent across Android and iOS.
           */
          useBarCodeDetectorIfSupported: false,
        }
      );
    }

    return scannerRef.current;
  }

  async function stopCamera() {
    const scanner =
      scannerRef.current;

    if (scanner && scanner.isScanning) {
      try {
        await scanner.stop();
      } catch (error) {
        console.error(
          "Error stopping camera:",
          error
        );
      }
    }

    setCameraStarted(false);
  }

  async function startCamera(
    facingModeOverride?:
      | "environment"
      | "user"
  ) {
    if (
      disabled ||
      startingRef.current
    ) {
      return;
    }

    startingRef.current = true;
    setStarting(true);
    setCameraError("");

    await stopCamera();

    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported by this browser."
        );

        return;
      }

      const scanner = getScanner();

      const modeToUse =
        facingModeOverride ??
        cameraFacingMode;

      await scanner.start(
        { facingMode: modeToUse },
        {
          fps: 10,
          videoConstraints: {
            facingMode: modeToUse,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          /*
           * Intentionally no "qrbox" here. A cropped
           * scan box can end up misaligned with what's
           * actually visible once CSS resizes the video,
           * or larger than the negotiated camera
           * resolution on some phones, both of which can
           * make html5-qrcode silently never find a match.
           * Scanning the full frame is far more reliable
           * across Android and iOS devices.
           */
        },
        (decodedText) => {
          const rawValue = decodedText
            .trim()
            .toUpperCase();

          if (rawValue) {
            void stopCamera();
            onScan(rawValue);
          }
        },
        () => {
          /*
           * Called on every frame where no QR
           * code is found. This is expected
           * while scanning, so we intentionally
           * ignore it. We do bump a counter so we
           * can visually confirm the scan loop is
           * actually running while diagnosing.
           */
          setScanAttempts((count) => count + 1);
        }
      );

      setCameraStarted(true);
      setScanAttempts(0);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraError(
        "Unable to access the camera. Please allow camera permission or use Manual Search."
      );

      setCameraStarted(false);
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  }

  async function switchCamera() {
    const nextFacingMode =
      cameraFacingMode === "environment"
        ? "user"
        : "environment";

    setCameraFacingMode(
      nextFacingMode
    );

    await startCamera(nextFacingMode);
  }

  useEffect(() => {
    return () => {
      const scanner =
        scannerRef.current;

      if (
        scanner &&
        scanner.isScanning
      ) {
        scanner
          .stop()
          .catch(() => {});
      }
    };
  }, []);

  /*
   * Temporary diagnostic: directly inspect the
   * actual <video> element html5-qrcode created,
   * since we can't access console/devtools on a
   * real phone. This confirms whether the video is
   * really playing with valid dimensions, and
   * whether the scanner thinks it's scanning.
   */
  useEffect(() => {
    if (!cameraStarted) {
      setVideoDebugInfo("");
      return;
    }

    const intervalId = setInterval(() => {
      const container = document.getElementById(
        QR_READER_ELEMENT_ID
      );

      const video =
        container?.querySelector("video");

      const scanner = scannerRef.current;

      if (!video) {
        setVideoDebugInfo(
          "no <video> element found in container"
        );
        return;
      }

      setVideoDebugInfo(
        `isScanning=${String(scanner?.isScanning)} paused=${video.paused} readyState=${video.readyState} video=${video.videoWidth}x${video.videoHeight} client=${video.clientWidth}x${video.clientHeight}`
      );
    }, 500);

    return () => clearInterval(intervalId);
  }, [cameraStarted]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-green-100 p-3 text-green-700">
          <FaCamera className="text-xl" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-green-600">
            QR Verification
          </p>

          <h3 className="font-bold text-green-900">
            Scan Explorer QR Code
          </h3>
        </div>
      </div>

      <p className="mb-4 text-sm leading-6 text-gray-600">
        Position the explorer&apos;s QR
        Code inside the camera frame.
      </p>

      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-black">
        <div
          id={QR_READER_ELEMENT_ID}
          className="w-full [&_video]:mx-auto [&_video]:!h-auto [&_video]:max-w-full"
        />

        {!cameraStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-center text-white">
            <div className="p-6">
              <FaCamera className="mx-auto text-5xl text-gray-500" />

              <p className="mt-4 text-sm text-gray-300">
                Camera is currently off.
              </p>
            </div>
          </div>
        )}

        {cameraStarted && (
          <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
            Scanning... ({scanAttempts})
          </div>
        )}
      </div>

      {cameraStarted && videoDebugInfo && (
        <div className="mt-2 break-all rounded-lg border border-blue-200 bg-blue-50 p-2 font-mono text-[10px] text-blue-800">
          {videoDebugInfo}
        </div>
      )}

      {cameraError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {cameraError}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {!cameraStarted ? (
          <button
            type="button"
            onClick={() =>
              void startCamera()
            }
            disabled={disabled || starting}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <FaCamera />
            {starting ? "Starting..." : "Start Camera"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              void stopCamera()
            }
            disabled={starting}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <FaStop />
            Stop Camera
          </button>
        )}

        <button
          type="button"
          onClick={() =>
            void switchCamera()
          }
          disabled={
            disabled ||
            starting ||
            !cameraStarted
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3 font-black text-green-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <FaCameraRotate />
          Switch Camera
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500">
        Works on both Android and iPhone/iPad.
        For event-day use on a phone or tablet,
        the rear camera is recommended.
      </p>
    </div>
  );
}