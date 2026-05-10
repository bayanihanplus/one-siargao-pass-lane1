type ControlTowerModuleActionStripProps = {
  [key: string]: unknown;
};

/**
 * Clean presentation-safe stub.
 * Intentionally does not import any action registry, contract adapter,
 * readiness board, backend contract endpoint, or mutation system.
 *
 * This preserves existing gate-page imports while removing polluted
 * contract/action UI from the active Control Tower source tree.
 */
export function ControlTowerModuleActionStrip(
  _props: ControlTowerModuleActionStripProps,
) {
  return null;
}
