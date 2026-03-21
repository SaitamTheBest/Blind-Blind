export function getToken() {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

export function parseJwt(token: string) {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;

  const payload = parseJwt(token);
  if (!payload) return null;

  return payload.Role || payload.role || null;
}