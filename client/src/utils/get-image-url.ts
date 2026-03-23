export const getImageUrl = (path?: string) => {
  if (!path) return "";

  if (import.meta.env.MODE === "production") {
    return path;
  }

  return `http://localhost:3001${path}`;
};
