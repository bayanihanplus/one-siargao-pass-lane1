"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type CameraState = "idle" | "starting" | "active" | "blocked" | "unsupported" | "error";

export default function TravelerScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [message, setMessage] = useState("Tap Start Camera to scan a governed OSP/SPM QR at the operator site.");

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unsupported");
      setMessage("Camera access is not supported in this browser. Use a mobile browser with camera permissions enabled.");
      return;
    }

    try {
      setCameraState("starting");
      setMessage("Starting camera…");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState("active");
      setMessage("Camera is active. Point it at the operator/site QR. Decoder and verification wiring will attach to the governed QR event API.");
    } catch (error) {
      console.error(error);
      setCameraState("blocked");
      setMessage("Camera could not start. Check browser camera permissions, then try again.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraState("idle");
    setMessage("Camera stopped. Tap Start Camera when ready to scan the operator/site QR.");
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eafbff 0%, #ffffff 54%, #eefaf8 100%)",
        padding: "18px 14px 92px",
        color: "#14264b",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gap: 14 }}>
        <header
          style={{
            display: "grid",
            gap: 8,
            padding: "10px 2px 2px",
          }}
        >
          <Link
            href="/traveler/passport-trails"
            style={{
              color: "#067889",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            ← Passport Trails
          </Link>

          <div
            style={{
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0891b2",
            }}
          >
            OSP / SPM Site Verification
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 32,
              lineHeight: 1.04,
              letterSpacing: "-0.055em",
              fontWeight: 950,
            }}
          >
            Scan Operator QR
          </h1>

          <p
            style={{
              margin: 0,
              color: "#53657d",
              fontSize: 15,
              lineHeight: 1.45,
              fontWeight: 720,
            }}
          >
            Use this at approved operator sites or verified stops. Stamps and progress should only unlock from governed OSP/SPM QR records.
          </p>
        </header>

        <section
          aria-label="Camera scanner"
          style={{
            border: "1px solid #bfe7ee",
            borderRadius: 28,
            background: "rgba(255,255,255,0.92)",
            padding: 12,
            boxShadow: "0 18px 42px rgba(8,61,103,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "4 / 5",
              borderRadius: 24,
              overflow: "hidden",
              background:
                cameraState === "active"
                  ? "#071827"
                  : "linear-gradient(135deg, #dff8ff, #f7fffb)",
              border: "1px solid rgba(191,231,238,0.92)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: cameraState === "active" ? "block" : "none",
              }}
            />

            {cameraState !== "active" ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 24,
                  display: "grid",
                  gap: 10,
                  justifyItems: "center",
                }}
              >
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 28,
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, #14b8c6, #11843d)",
                    color: "#ffffff",
                    fontSize: 34,
                    fontWeight: 950,
                    boxShadow: "0 14px 30px rgba(7,141,160,0.22)",
                  }}
                >
                  ▣
                </div>

                <div
                  style={{
                    fontSize: 18,
                    lineHeight: 1.15,
                    fontWeight: 950,
                    color: "#14264b",
                  }}
                >
                  Camera-ready QR scanner
                </div>

                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.4,
                    fontWeight: 720,
                    color: "#53657d",
                    maxWidth: 280,
                  }}
                >
                  Start the camera at the operator site. QR decoding and verification API wiring will attach in the next controlled backend lane.
                </div>
              </div>
            ) : null}

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 22,
                border: "2px solid rgba(255,255,255,0.72)",
                borderRadius: 24,
                boxShadow: "0 0 0 999px rgba(4,19,36,0.10)",
                pointerEvents: "none",
              }}
            />

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "72%",
                height: 2,
                transform: "translate(-50%, -50%)",
                background: "linear-gradient(90deg, transparent, rgba(20,184,198,0.92), transparent)",
                boxShadow: "0 0 18px rgba(20,184,198,0.62)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <p
              style={{
                margin: 0,
                color: "#53657d",
                fontSize: 13,
                lineHeight: 1.45,
                fontWeight: 760,
              }}
            >
              {message}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                onClick={startCamera}
                disabled={cameraState === "starting" || cameraState === "active"}
                style={{
                  minHeight: 52,
                  border: 0,
                  borderRadius: 18,
                  background:
                    cameraState === "active"
                      ? "#cbd5e1"
                      : "linear-gradient(135deg, #14b8c6, #11843d)",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 950,
                  cursor: cameraState === "active" ? "not-allowed" : "pointer",
                  boxShadow: "0 10px 22px rgba(7,141,160,0.18)",
                }}
              >
                Start Camera
              </button>

              <button
                type="button"
                onClick={stopCamera}
                style={{
                  minHeight: 52,
                  border: "1px solid #bfe7ee",
                  borderRadius: 18,
                  background: "#ffffff",
                  color: "#067889",
                  fontSize: 14,
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                Stop
              </button>
            </div>
          </div>
        </section>

        <section
          aria-label="Verification note"
          style={{
            border: "1px solid rgba(245,158,11,0.34)",
            borderRadius: 24,
            background: "linear-gradient(135deg, #ffffff, #fff8dc)",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#b45309",
              marginBottom: 8,
            }}
          >
            Verification Rule
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.45,
              fontWeight: 760,
              color: "#53657d",
            }}
          >
            This screen opens the traveler camera for site QR scanning. It does not fake stamp completion. Actual Passport Stamp issuance must be created only after a valid governed QR event is verified by the backend.
          </p>
        </section>
      </div>
    </main>
  );
}
