import { useEffect, useRef, useState } from "react";
import { API_URL } from "../config";
import AccountLoginView from "../components/account/AccountLoginView";
import AccountRegisterView from "../components/account/AccountRegisterView";
import AccountForgotPasswordView from "../components/account/AccountForgotPasswordView";
import AccountProfileView from "../components/account/AccountProfileView";
import AccountChangePasswordView from "../components/account/AccountChangePasswordView";
import defaultProfile from "../res/default_profil.svg";
import {
  canSubmitLogin,
  canSubmitRegister,
  getRegisterFormError,
  getChangePasswordFormError,
  canSubmitChangePassword,
} from "../utils/accountValidation";

export type AccountView =
  | "login"
  | "register"
  | "forgot-password"
  | "profile"
  | "change-password";

type JwtPayload = {
  exp?: number;
  Id_User?: string;
  Email?: string;
  Role?: string;
  Name?: string;
  Avatar?: string;
  nameid?: string;
  email?: string;
  role?: string;
  unique_name?: string;
  username?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Impossible de décoder le token :", error);
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const payload = parseJwt(token);

  if (!payload?.exp) return false;

  const now = Date.now() / 1000;
  return payload.exp > now;
}

function getClaimUserId(payload: JwtPayload): string {
  return (
    payload.Id_User ||
    payload.nameid ||
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ||
    ""
  );
}

function getClaimEmail(payload: JwtPayload): string {
  return (
    payload.Email ||
    payload.email ||
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ] ||
    ""
  );
}

function getClaimUsername(payload: JwtPayload): string {
  return payload.Name || payload.username || payload.unique_name || "";
}

function getStoredAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

function getStoredRefreshToken(): string | null {
  return (
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken")
  );
}

function clearAuthStorage(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("rememberMe");

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}

function storeAuthTokens(
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

function getClaimRoleId(payload: JwtPayload): string {
  const role = payload.Role || payload.role || "";
  return role === "Admin" ? "2" : "1";
}

function applyProfileFromToken(
  token: string,
  setUsername: (value: string) => void,
  setProfileEmail: (value: string) => void
): void {
  const payload = parseJwt(token);

  if (!payload) return;

  const tokenUsername = getClaimUsername(payload);
  const tokenEmail = getClaimEmail(payload);

  if (tokenUsername) {
    setUsername(tokenUsername);
  }

  if (tokenEmail) {
    setProfileEmail(tokenEmail);
  }
}



export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<AccountView>("login");

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");

  // Profile
  const [username, setUsername] = useState("John Doe");
  const [profileEmail, setProfileEmail] = useState("john@doe.com");
  const [profileImage, setProfileImage] = useState<string>(defaultProfile);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  

  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe");
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();

    if (storedRememberMe === "true") {
      setRememberMe(true);
    }

    if (accessToken && refreshToken && isTokenValid(accessToken)) {
      applyProfileFromToken(accessToken, setUsername, setProfileEmail);
      setIsLoggedIn(true);
      setView("profile");
      return;
    }

    if (accessToken || refreshToken) {
      clearAuthStorage();
    }
  }, []);

  const resetProfileState = () => {
    setUsername("");
    setProfileEmail("");
    setProfileImage(defaultProfile);
  };

  const resetLoginState = () => {
    setEmail("");
    setPassword("");
    setLoginError("");
    setRememberMe(false);
  };

  const handleProfileImageChange = async (file: File | null) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    try {
      const token = getStoredAccessToken();

      if (!token) {
        throw new Error("Aucun token trouvé.");
      }

      const payload = parseJwt(token);

      if (!payload) {
        throw new Error("Token invalide.");
      }

      const userId = getClaimUserId(payload);

      if (!userId) {
        throw new Error(
          "Impossible de récupérer l'identifiant utilisateur depuis le token."
        );
      }

      const formData = new FormData();
      formData.append("Id_User", userId);
      formData.append("Username", username);
      formData.append("Avatar", file);
      formData.append("Id_Rank", "1");
      formData.append("Id_Role", getClaimRoleId(payload));
      formData.append("Elo", "0");

      const updateResponse = await fetch(`${API_URL}/api/users/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(errorText || "Erreur lors de la mise à jour de l'avatar.");
      }

      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        throw new Error("Aucun refresh token trouvé.");
      }

      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        throw new Error(errorText || "Impossible de rafraîchir la session.");
      }

      const refreshData = await refreshResponse.json();
      const persist = localStorage.getItem("rememberMe") === "true";

      storeAuthTokens(
        refreshData.accessToken,
        refreshData.refreshToken,
        persist
      );

      applyProfileFromToken(
        refreshData.accessToken,
        setUsername,
        setProfileEmail
      );

      window.dispatchEvent(new Event("authChanged"));
    } catch (error) {
      console.error("Erreur mise à jour avatar :", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour de l'avatar."
      );
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = getStoredAccessToken();

      if (!token) {
        throw new Error("Aucun token trouvé.");
      }

      const payload = parseJwt(token);

      if (!payload) {
        throw new Error("Token invalide.");
      }

      const userId = getClaimUserId(payload);

      if (!userId) {
        throw new Error(
          "Impossible de récupérer l'identifiant utilisateur depuis le token."
        );
      }

      const formData = new FormData();
      formData.append("Id_User", userId);
      formData.append("Username", username);
      formData.append("Id_Rank", "1");
      formData.append("Id_Role", getClaimRoleId(payload));
      formData.append("Elo", "0");

      const updateResponse = await fetch(`${API_URL}/api/users/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(errorText || "Erreur lors de la mise à jour du profil.");
      }

      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        throw new Error("Aucun refresh token trouvé.");
      }

      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        throw new Error(errorText || "Impossible de rafraîchir la session.");
      }

      const refreshData = await refreshResponse.json();
      const persist = localStorage.getItem("rememberMe") === "true";

      storeAuthTokens(
        refreshData.accessToken,
        refreshData.refreshToken,
        persist
      );

      applyProfileFromToken(
        refreshData.accessToken,
        setUsername,
        setProfileEmail
      );

      window.dispatchEvent(new Event("authChanged"));
      
      alert("Profil mis à jour avec succès.");
    } catch (error) {
      console.error("Erreur mise à jour profil :", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour du profil."
      );
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    setIsLoginLoading(true);

    if (!canSubmitLogin(email, password)) {
      setLoginError("Merci de renseigner un email valide et un mot de passe.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setLoginError(errorText || "Email ou mot de passe invalide");
        return;
      }

      const data = await response.json();

      clearAuthStorage();

      storeAuthTokens(data.accessToken, data.refreshToken, rememberMe);

      applyProfileFromToken(data.accessToken, setUsername, setProfileEmail);

      setIsLoggedIn(true);
      setView("profile");
      window.dispatchEvent(new Event("authChanged"));

    } catch (error) {
      console.error("Erreur login :", error);
      setLoginError("Impossible de contacter le serveur");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterError("");
    setRegisterSuccess("");

    const registerFormError = getRegisterFormError(
      registerEmail,
      registerUsername,
      registerPassword,
      registerPasswordConfirm
    );

    if (registerFormError) {
      setRegisterError(registerFormError);
      return;
    }

    try {
      setIsRegisterLoading(true);

      const formData = new FormData();
      formData.append("Email", registerEmail);
      formData.append("Password", registerPassword);
      formData.append("User.Username", registerUsername);
      formData.append("User.Avatar", "");

      const response = await fetch(`${API_URL}/api/users/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de la création du compte.");
      }

      await response.json();

      setRegisterSuccess("Compte créé avec succès !");
      setEmail(registerEmail);
      setPassword("");

      setRegisterEmail("");
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterPasswordConfirm("");

      setTimeout(() => {
        setView("login");
      }, 1000);
    } catch (error) {
      console.error("Erreur inscription :", error);
      setRegisterError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription."
      );
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleLogout = async () => {
    const refreshToken = getStoredRefreshToken();

    try {
      if (refreshToken) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(refreshToken),
        });
      }
    } catch (error) {
      console.error("Erreur logout :", error);
    } finally {
      clearAuthStorage();
      setIsLoggedIn(false);
      setView("login");
      resetLoginState();
      window.dispatchEvent(new Event("authChanged"));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Es-tu sûr de vouloir supprimer définitivement ton compte ?"
    );

    if (!confirmed) return;

    try {
      const token = getStoredAccessToken();

      if (!token) {
        throw new Error("Aucun token trouvé.");
      }

      const payload = parseJwt(token);

      if (!payload) {
        throw new Error("Token invalide.");
      }

      const userId = getClaimUserId(payload);

      if (!userId) {
        throw new Error(
          "Impossible de récupérer l'identifiant utilisateur depuis le token."
        );
      }

      const response = await fetch(`${API_URL}/api/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de la suppression du compte.");
      }

      clearAuthStorage();
      setIsLoggedIn(false);
      setView("login");
      resetProfileState();
      resetLoginState();
      clearAuthStorage();
      window.dispatchEvent(new Event("authChanged"));

      alert("Compte supprimé avec succès.");
    } catch (error) {
      console.error("Erreur suppression compte :", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression du compte."
      );
    }
  };

  if (view === "forgot-password") {
    return (
      <AccountForgotPasswordView
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
        onBackToLogin={() => setView("login")}
      />
    );
  }

  if (view === "change-password") {
    return (
      <AccountChangePasswordView
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmNewPassword={confirmNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
        onBackToProfile={() => setView("profile")}
      />
    );
  }

  if (view === "register") {
    return (
      <AccountRegisterView
        registerEmail={registerEmail}
        setRegisterEmail={setRegisterEmail}
        registerUsername={registerUsername}
        setRegisterUsername={setRegisterUsername}
        registerPassword={registerPassword}
        setRegisterPassword={setRegisterPassword}
        registerPasswordConfirm={registerPasswordConfirm}
        setRegisterPasswordConfirm={setRegisterPasswordConfirm}
        registerError={registerError}
        registerSuccess={registerSuccess}
        isRegisterLoading={isRegisterLoading}
        onGoToLogin={() => setView("login")}
        onRegister={handleRegister}
      />
    );
  }

  if (isLoggedIn || view === "profile") {
    return (
      <AccountProfileView
        username={username}
        setUsername={setUsername}
        profileEmail={profileEmail}
        setProfileEmail={setProfileEmail}
        profileImage={profileImage}
        resetRef={resetRef}
        onProfileImageChange={handleProfileImageChange}
        onGoToChangePassword={() => setView("change-password")}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onSaveProfile={handleSaveProfile}
        onSubmitSongSuggestion={(data) => {
          console.log("Nouvelle proposition :", data);
        }}
        songSuggestions={[
          {
            id: 1,
            title: "Numb",
            artist: "Linkin Park",
            status: "accepted",
          },
          {
            id: 2,
            title: "Blinding Lights",
            artist: "The Weeknd",
            status: "pending",
          },
          {
            id: 3,
            title: "Believer",
            artist: "Imagine Dragons",
            status: "rejected",
          },
        ]}
      />
    );
  }

  return (
    <AccountLoginView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      loginError={loginError}
      isLoginLoading={isLoginLoading}
      onGoToRegister={() => setView("register")}
      onGoToForgotPassword={() => setView("forgot-password")}
      onLogin={handleLogin}
    />
  );
}