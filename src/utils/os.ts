export type OsKey = "windows" | "macos_linux";

export function detectOs(): OsKey {
  return typeof navigator !== "undefined" && /win/i.test(navigator.userAgent) ? "windows" : "macos_linux";
}

export const OS_LABEL: Record<OsKey, string> = {
  windows: "Windows (PowerShell)",
  macos_linux: "macOS / Linux",
};