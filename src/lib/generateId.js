// Small utility to generate a client-side id with a safe fallback
export default function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // fallthrough to fallback
    }
  }

  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
