export const SESSION_KEY = "orbit:session";

export type DemoSession = {
  userId: "u_me";
  mode: "demo";
  createdAt: string;
};

export function readSession(): DemoSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (parsed.userId !== "u_me" || parsed.mode !== "demo" || typeof parsed.createdAt !== "string") return null;
    return { userId: "u_me", mode: "demo", createdAt: parsed.createdAt };
  } catch {
    return null;
  }
}

export function writeSession() {
  const session: DemoSession = { userId: "u_me", mode: "demo", createdAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function requestSignOut() {
  window.dispatchEvent(new Event("orbit-signout"));
}
