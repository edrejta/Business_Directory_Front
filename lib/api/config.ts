// Default to same-origin so browser calls /api/* through ingress path routing.
export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
