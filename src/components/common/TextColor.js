export const isLightColor = (hexColor) => {
  // Convert hex color to RGB object
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex?.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return {r, g, b};
  };

  // Calculate luminance
  const rgb = hexToRgb(hexColor);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // You can adjust the threshold based on your preference
  return luminance > 0.5; // If luminance is greater than 0.5, consider it a light color
};
