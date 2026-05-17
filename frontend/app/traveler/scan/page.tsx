"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const OSP = {
  navy: "#013863",
  deep: "#002E52",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  slate: "#50668B",
} as const;

type CameraState = "starting" | "ready" | "blocked" | "captured" | "detected";

type DetectedQr = {
  rawValue: string;
};

export default function TravelerScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const scanTimerRef = useRef<number | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>("starting");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [detectedQr, setDetectedQr] = useState<DetectedQr | null>(null);
  const [detectorAvailable, setDetectorAvailable] = useState(false);

  const stopDetection = useCallback(() => {
    if (scanTimerRef.current) {
      window.clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopDetection();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, [stopDetection]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth || 720;
    const height = video.videoHeight || 1280;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, width, height);
    setCapturedImage(canvas.toDataURL("image/png"));
    setCameraState("captured");
    stopDetection();
  }, [stopDetection]);

  const startDetection = useCallback(() => {
    stopDetection();

    const detector = detectorRef.current;
    if (!detector) return;

    scanTimerRef.current = window.setInterval(async () => {
      const video = videoRef.current;

      if (!video || video.readyState < 2) return;

      try {
        const results = await detector.detect(video);

        if (Array.isArray(results) && results.length > 0) {
          const first = results[0];
          const rawValue = typeof first?.rawValue === "string" ? first.rawValue : "";

          if (rawValue) {
            setDetectedQr({ rawValue });
            setCameraState("detected");
            stopCamera();
          }
        }
      } catch {
        // Detection may fail on some frames. Keep camera alive.
      }
    }, 650);
  }, [stopCamera, stopDetection]);

  const startCamera = useCallback(async () => {
    setCapturedImage(null);
    setUploadedImageName(null);
    setDetectedQr(null);
    setCameraState("starting");

    try {
      stopCamera();

      const BarcodeDetectorCtor = (window as any).BarcodeDetector;
      if (BarcodeDetectorCtor) {
        detectorRef.current = new BarcodeDetectorCtor({ formats: ["qr_code"] });
        setDetectorAvailable(true);
      } else {
        detectorRef.current = null;
        setDetectorAvailable(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState("ready");
      startDetection();
    } catch {
      setCameraState("blocked");
    }
  }, [startDetection, stopCamera]);

  const handleUploadQr = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      stopCamera();
      setUploadedImageName(file.name);
      setDetectedQr(null);

      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setCameraState("captured");

      try {
        const BarcodeDetectorCtor = (window as any).BarcodeDetector;

        if (!BarcodeDetectorCtor) {
          setDetectorAvailable(false);
          return;
        }

        const detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });
        setDetectorAvailable(true);

        const bitmap = await createImageBitmap(file);
        const results = await detector.detect(bitmap);

        if (Array.isArray(results) && results.length > 0) {
          const first = results[0];
          const rawValue = typeof first?.rawValue === "string" ? first.rawValue : "";

          if (rawValue) {
            setDetectedQr({ rawValue });
            setCameraState("detected");
          }
        }
      } catch {
        // Uploaded image can still be previewed even when browser QR detection fails.
      } finally {
        event.target.value = "";
      }
    },
    [stopCamera],
  );

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const statusLabel =
    cameraState === "detected"
      ? "QR detected"
      : cameraState === "captured"
        ? "Frame captured"
        : cameraState === "blocked"
          ? "Camera blocked"
          : cameraState === "starting"
            ? "Opening camera"
            : detectorAvailable
              ? "Scanning"
              : "Camera ready";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -6%, rgba(5,150,165,0.20), transparent 34%), radial-gradient(circle at 50% 100%, rgba(243,174,38,0.10), transparent 36%), linear-gradient(180deg, #EAFBFA 0%, #F9FEFD 46%, #FFFDF8 100%)",
        color: OSP.navy,
        padding: "16px 14px 24px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: "min(430px, 100%)",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Link
            href="/traveler/pass"
            style={{
              minHeight: 38,
              padding: "0 15px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(1,56,99,0.065)",
              color: OSP.navy,
              fontSize: 13.5,
              fontWeight: 900,
              boxShadow: "0 10px 22px rgba(1,56,99,0.045)",
              backdropFilter: "blur(14px)",
            }}
          >
            ← Pass
          </Link>

          <span
            style={{
              minHeight: 32,
              padding: "0 13px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(5,150,165,0.14)",
              color: OSP.teal,
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              boxShadow: "0 9px 20px rgba(1,56,99,0.035)",
              backdropFilter: "blur(14px)",
            }}
          >
            {statusLabel}
          </span>
        </header>

        <article
          style={{
            borderRadius: 34,
            overflow: "hidden",
            background: OSP.deep,
            border: "1px solid rgba(255,255,255,0.62)",
            boxShadow:
              "0 30px 86px rgba(1,56,99,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "min(74vh, 670px)",
              minHeight: 560,
              background: OSP.deep,
              overflow: "hidden",
            }}
          >
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured scan frame"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "saturate(0.98)",
                }}
              />
            ) : (
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: cameraState === "ready" || cameraState === "detected" ? "block" : "none",
                  filter: "saturate(0.98) contrast(1.02)",
                }}
              />
            )}

            {(cameraState === "starting" || cameraState === "blocked") && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  padding: 24,
                  color: "#FFFFFF",
                  textAlign: "center",
                  background:
                    "radial-gradient(circle at 50% 38%, rgba(5,150,165,0.22), transparent 34%), linear-gradient(180deg, rgba(0,46,82,0.98), rgba(1,56,99,0.94))",
                }}
              >
                {cameraState === "starting" ? (
                  <div>
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        margin: "0 auto 14px",
                        borderRadius: 22,
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        display: "grid",
                        placeItems: "center",
                        color: OSP.gold,
                        fontSize: 12,
                        fontWeight: 1000,
                      }}
                    >
                      QR
                    </div>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 950 }}>Opening camera…</p>
                  </div>
                ) : (
                  <div>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: 19,
                        lineHeight: 1.1,
                        fontWeight: 950,
                        letterSpacing: "-0.025em",
                      }}
                    >
                      Camera permission needed
                    </p>
                    <p
                      style={{
                        margin: "0 auto 16px",
                        color: "rgba(255,255,255,0.76)",
                        fontSize: 13,
                        lineHeight: 1.4,
                        fontWeight: 700,
                        maxWidth: 260,
                      }}
                    >
                      Allow camera access to scan a supported OSP QR point.
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      style={{
                        minHeight: 46,
                        padding: "0 18px",
                        borderRadius: 16,
                        border: "0",
                        background: OSP.gold,
                        color: OSP.deep,
                        fontSize: 14,
                        fontWeight: 950,
                        cursor: "pointer",
                        boxShadow: "0 14px 28px rgba(243,174,38,0.24)",
                      }}
                    >
                      Start Camera
                    </button>
                  </div>
                )}
              </div>
            )}

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,46,82,0.10), transparent 20%, transparent 72%, rgba(0,46,82,0.44))",
                pointerEvents: "none",
              }}
            />

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                top: "44%",
                width: 236,
                height: 236,
                transform: "translate(-50%, -50%)",
                borderRadius: 8,
                boxShadow: "0 0 0 999px rgba(0,46,82,0.34)",
                pointerEvents: "none",
              }}
            />

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                top: "44%",
                width: 236,
                height: 236,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              {[
                ["left", "top", "0 0 0 0"],
                ["right", "top", "0 0 0 0"],
                ["left", "bottom", "0 0 0 0"],
                ["right", "bottom", "0 0 0 0"],
              ].map(([x, y]) => (
                <span
                  key={`${x}-${y}`}
                  style={{
                    position: "absolute",
                    [x]: 0,
                    [y]: 0,
                    width: 48,
                    height: 48,
                    borderColor: OSP.gold,
                    borderStyle: "solid",
                    borderWidth:
                      x === "left" && y === "top"
                        ? "5px 0 0 5px"
                        : x === "right" && y === "top"
                          ? "5px 5px 0 0"
                          : x === "left" && y === "bottom"
                            ? "0 0 5px 5px"
                            : "0 5px 5px 0",
                    borderRadius: x === "left" && y === "top"
                      ? "8px 0 0 0"
                      : x === "right" && y === "top"
                        ? "0 8px 0 0"
                        : x === "left" && y === "bottom"
                          ? "0 0 0 8px"
                          : "0 0 8px 0",
                    filter: "drop-shadow(0 0 10px rgba(243,174,38,0.34))",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span
                style={{
                  minHeight: 32,
                  padding: "0 12px",
                  borderRadius: 999,
                  background: "rgba(0,46,82,0.48)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#FFFFFF",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: 900,
                  backdropFilter: "blur(12px)",
                }}
              >
                OSP QR Reader
              </span>

              <span
                style={{
                  minHeight: 32,
                  padding: "0 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: OSP.gold,
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 11,
                  fontWeight: 950,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  backdropFilter: "blur(12px)",
                }}
              >
                QR
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 18,
                display: "grid",
                gap: 12,
              }}
            >
              {cameraState === "detected" && detectedQr && (
                <div
                  style={{
                    borderRadius: 22,
                    background: "rgba(255,255,255,0.94)",
                    border: "1px solid rgba(255,255,255,0.72)",
                    boxShadow: "0 16px 34px rgba(1,56,99,0.20)",
                    padding: 14,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      color: OSP.gold,
                      fontSize: 10,
                      fontWeight: 950,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    QR captured
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: OSP.navy,
                      fontSize: 13,
                      lineHeight: 1.35,
                      fontWeight: 850,
                      wordBreak: "break-word",
                    }}
                  >
                    {detectedQr.rawValue}
                  </p>
                </div>
              )}

              {cameraState !== "detected" && (
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.86)",
                    fontSize: 13,
                    lineHeight: 1.35,
                    fontWeight: 760,
                    textAlign: "center",
                    textShadow: "0 2px 14px rgba(0,46,82,0.55)",
                  }}
                >
                  {uploadedImageName ? `Uploaded: ${uploadedImageName}` : "Align a QR code inside the square."}
                </p>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  onClick={
                    cameraState === "captured" || cameraState === "detected"
                      ? startCamera
                      : captureFrame
                  }
                  disabled={cameraState === "starting" || cameraState === "blocked"}
                  style={{
                    minHeight: 52,
                    borderRadius: 18,
                    border: "0",
                    background:
                      cameraState === "starting" || cameraState === "blocked"
                        ? "rgba(255,255,255,0.20)"
                        : OSP.teal,
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: 950,
                    cursor:
                      cameraState === "starting" || cameraState === "blocked"
                        ? "not-allowed"
                        : "pointer",
                    boxShadow:
                      cameraState === "starting" || cameraState === "blocked"
                        ? "none"
                        : "0 16px 34px rgba(5,150,165,0.22)",
                  }}
                >
                  {cameraState === "captured" || cameraState === "detected" ? "Scan Again" : "Capture"}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    minHeight: 52,
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.72)",
                    background: "rgba(255,255,255,0.94)",
                    color: OSP.navy,
                    fontSize: 15,
                    fontWeight: 920,
                    boxShadow: "0 12px 28px rgba(1,56,99,0.14)",
                    backdropFilter: "blur(14px)",
                    cursor: "pointer",
                  }}
                >
                  Upload QR
                </button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadQr}
            style={{ display: "none" }}
          />

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </article>
      </section>
    </main>
  );
}
