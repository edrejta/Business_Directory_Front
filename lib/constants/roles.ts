/**
 * Roler që lejohen gjatë regjistrimit të përdoruesit.
 * Admin (2) nuk lejohet – caktohet vetëm nga një admin ekzistues.
 */
export const SIGNUP_ROLES = [
  { value: 0, label: "Përdorues" },
  { value: 1, label: "Pronar Biznesi" },
] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number]["value"];
