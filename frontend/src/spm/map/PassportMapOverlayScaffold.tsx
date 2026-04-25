import {
  TRI_ISLAND_JOINER_MAP_NODE_CODES,
  getSiargaoPassportMapCoordinate,
  type PassportMapLabelAlign,
} from "./siargaoMapCoordinates";

type PassportMapOverlayNodeState = {
  nodeCode: string;
  nodeName?: string;
  isStamped?: boolean;
  verificationStatus?: string | null;
};

type PassportMapOverlayScaffoldProps = {
  nodes?: PassportMapOverlayNodeState[];
  showInternalLabel?: boolean;
};

function getNodeLabel(nodeCode: string, fallback?: string) {
  if (fallback) return fallback;

  return nodeCode
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getNodeState(nodes: PassportMapOverlayNodeState[] | undefined, nodeCode: string) {
  return nodes?.find((node) => node.nodeCode === nodeCode) ?? null;
}

function getLabelTransform(labelAlign: PassportMapLabelAlign) {
  if (labelAlign === "right") return "translate(-100%, -50%)";
  if (labelAlign === "center") return "translate(-50%, -50%)";
  return "translate(0, -50%)";
}

/**
 * SPM-07H controlled scaffold only.
 *
 * This component is intentionally isolated and not wired into the traveler page yet.
 * It uses the parked non-final placeholder asset strictly as a layout-test surface.
 *
 * Hard rules:
 * - Not final illustrated map art.
 * - Not a Google Maps base.
 * - Not schema-backed coordinates.
 * - Tri-Island Joiner nodes only.
 * - No production geography claim.
 */
export function PassportMapOverlayScaffold(props: PassportMapOverlayScaffoldProps) {
  const showInternalLabel = props.showInternalLabel ?? true;

  return (
    <section
      aria-label="Non-final Siargao Passport Map overlay layout scaffold"
      style={{
        borderRadius: 28,
        overflow: "hidden",
        background: "linear-gradient(180deg, #e8f7fb 0%, #f8fbff 100%)",
        border: "1px solid rgba(19,168,183,0.20)",
        boxShadow: "0 18px 45px rgba(20,38,75,0.12)",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 280,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.16) 100%), url("/spm/siargao-passport-map-placeholder.svg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {showInternalLabel ? (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 4,
              borderRadius: 999,
              padding: "7px 10px",
              background: "rgba(20,38,75,0.82)",
              color: "#ffffff",
              fontSize: 9,
              fontWeight: 950,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: "0 10px 24px rgba(20,38,75,0.18)",
            }}
          >
            Internal layout scaffold · non-final map
          </div>
        ) : null}

        {TRI_ISLAND_JOINER_MAP_NODE_CODES.map((nodeCode) => {
          const coordinate = getSiargaoPassportMapCoordinate(nodeCode);
          if (!coordinate) return null;

          const state = getNodeState(props.nodes, nodeCode);
          const isStamped = state?.isStamped === true;
          const verificationStatus = state?.verificationStatus ?? "NOT_VERIFIED";
          const label = getNodeLabel(nodeCode, state?.nodeName);

          return (
            <div key={nodeCode}>
              <span
                aria-label={`${label} map marker`}
                style={{
                  position: "absolute",
                  left: `${coordinate.mapX}%`,
                  top: `${coordinate.mapY}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 3,
                  width: isStamped ? 22 : 18,
                  height: isStamped ? 22 : 18,
                  borderRadius: "50%",
                  background: isStamped ? "#1fa45b" : "#13a8b7",
                  border: "3px solid rgba(255,255,255,0.92)",
                  boxShadow: "0 10px 22px rgba(20,38,75,0.26)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: `${coordinate.labelX}%`,
                  top: `${coordinate.labelY}%`,
                  transform: getLabelTransform(coordinate.labelAlign),
                  zIndex: 3,
                  maxWidth: 118,
                  borderRadius: 14,
                  padding: "6px 8px",
                  background: "rgba(255,255,255,0.94)",
                  color: "#14264b",
                  boxShadow: "0 10px 22px rgba(20,38,75,0.14)",
                  border: isStamped
                    ? "1px solid rgba(31,164,91,0.34)"
                    : "1px solid rgba(19,168,183,0.24)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 950,
                    lineHeight: 1.05,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 7,
                    fontWeight: 900,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isStamped ? "#1fa45b" : "#64748b",
                  }}
                >
                  {isStamped ? "Stamped · Verified" : verificationStatus}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
