/**
 * Cross-platform WebGL support detection (Mac, Windows, Linux).
 * Checks for WebGL1/WebGL2 via canvas before relying on Three.js.
 */
function getWebGLContext(canvas, options = {}) {
  if (typeof document === "undefined" || !canvas) return null;
  const attrs = { alpha: true, antialias: true, ...options };
  try {
    return (
      canvas.getContext("webgl2", attrs) ||
      canvas.getContext("webgl", attrs) ||
      canvas.getContext("experimental-webgl", attrs)
    );
  } catch {
    return null;
  }
}

/**
 * Returns true if the environment supports WebGL (for 3D view).
 * Safe to call in SSR or headless environments. Works on Mac & Windows.
 */
export function isWebGLAvailable() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = getWebGLContext(canvas);
    if (!gl) return false;
    return true;
  } catch {
    return false;
  }
}

export default isWebGLAvailable;
