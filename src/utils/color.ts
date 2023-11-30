/**
 * Converts a hex color code to its RGBA equivalent with a given opacity.
 * @param {string} hex - The hex color code (e.g., '#ffffff') to be converted.
 * @param {number} opacity - The opacity percentage (0 to 100) for the RGBA color.
 * @returns {string} The RGBA color value as a string (e.g., 'rgba(255, 255, 255, 0.5)').
 */
export function hexToRGBA(hex: string, opacity: number) {
  // Remove '#' from the hex color if present
  hex = hex.replace('#', '');

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Ensure opacity is within the valid range (0 to 100)
  opacity = Math.max(0, Math.min(100, opacity));

  // Convert opacity percentage to a value between 0 and 1
  const alpha = opacity / 100;

  // Return the RGBA value
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
