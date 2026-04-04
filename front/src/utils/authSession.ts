import { API_URL } from "../config";

export function getStoredAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

export function getStoredRefreshToken(): string | null {
  return (
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken")
  );
}

export function clearAuthStorage(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("rememberMe");

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}

export function storeAuthTokens(
  accessToken: string,
  refreshToken: string,
  persist: boolean
): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");

  if (persist) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("rememberMe", "true");
  } else {
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    localStorage.removeItem("rememberMe");
  }
}

export async function tryRefreshSessionOnAppStart(): Promise<boolean> {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    clearAuthStorage();
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearAuthStorage();
      return false;
    }

    const data = await response.json();
    const persist = localStorage.getItem("rememberMe") === "true";

    storeAuthTokens(data.accessToken, data.refreshToken, persist);
    return true;
  } catch {
    clearAuthStorage();
    return false;
  }
}