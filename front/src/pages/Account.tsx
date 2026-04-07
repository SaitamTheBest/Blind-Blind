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
  getRegisterFormError,
} from "../utils/accountValidation";
import { notifyError, notifySuccess } from "../utils/notify";

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

type UserProfileResponse = {
  id_User?: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  elo?: number;
  rank?: {
    id_Rank?: number;
    start_Elo?: number;
    end_Elo?: number;
    rank_Name?: string;
    image_Rank?: string | null;
  } | null;
  roles?: {
    id_Roles?: number;
    role_Name?: string;
  } | null;
};

type SuggestionStatus = "pending" | "accepted" | "rejected";

type SongSuggestion = {
  id: number;
  title: string;
  album?: string;
  artist: string;
  status: SuggestionStatus;
  message?: string;
  createdAt?: string;
};

type SuggestionFormData = {
  title: string;
  album?: string;
  artist: string;
  message?: string;
};

type ApiSongSuggestionResponseItem = {
  idSuggestion?: number;
  id_suggestion?: number;
  title?: string;
  albumName?: string;
  album_name?: string;
  artistName?: string;
  artist_name?: string;
  artist_Name?: string;
  message?: string | null;
  status?: string;
  createdAt?: string;
  created_at?: string;
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
        .map(
          (char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`
        )
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

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Impossible de lire le fichier."));
        return;
      }

      const parts = reader.result.split(",");

      if (parts.length < 2) {
        reject(new Error("Format base64 invalide."));
        return;
      }

      resolve(parts[1]);
    };

    reader.onerror = () => {
      reject(new Error("Erreur lors de la conversion de l'image."));
    };
  });
};

const refreshSession = async (
  setUsername: (value: string) => void,
  setProfileEmail: (value: string) => void
): Promise<string> => {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    throw new Error("Aucun refresh token trouvé.");
  }

  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Impossible de rafraîchir la session.");
  }

  const data = await response.json();
  const persist = localStorage.getItem("rememberMe") === "true";

  storeAuthTokens(data.accessToken, data.refreshToken, persist);
  applyProfileFromToken(data.accessToken, setUsername, setProfileEmail);

  return data.accessToken;
};

function extractBase64FromImageSrc(imageSrc: string): string {
  if (!imageSrc) return "";

  if (imageSrc.startsWith("data:image")) {
    const parts = imageSrc.split(",");
    return parts.length > 1 ? parts[1] : "";
  }

  return "";
}

function normalizeSuggestionStatus(value?: string): SuggestionStatus {
  if (value === "accepted") return "accepted";
  if (value === "rejected") return "rejected";
  return "pending";
}

function mapApiSuggestionToFront(
  item: ApiSongSuggestionResponseItem
): SongSuggestion {
  return {
    id: Number(item.idSuggestion ?? item.id_suggestion ?? 0),
    title: item.title ?? "",
    album: item.albumName ?? item.album_name ?? "",
    artist: item.artistName ?? item.artist_name ?? item.artist_Name ?? "",
    status: normalizeSuggestionStatus(item.status),
    message: item.message ?? "",
    createdAt: item.createdAt ?? item.created_at ?? "",
  };
}

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<AccountView>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");

  const [username, setUsername] = useState("John Doe");
  const [profileEmail, setProfileEmail] = useState("john@doe.com");
  const [profileImage, setProfileImage] = useState<string>(defaultProfile);
  const [rankName, setRankName] = useState("Aucun rang");
  const [rankImage, setRankImage] = useState<string | null>(null);

  const [songSuggestions, setSongSuggestions] = useState<SongSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const resetRef = useRef<() => void>(null);

  const fetchUserProfile = async (userId: string, token: string) => {
    const response = await fetch(`${API_URL}/api/users/getById/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Impossible de récupérer le profil utilisateur."
      );
    }

    const data: UserProfileResponse = await response.json();

    if (data.username) {
      setUsername(data.username);
    }

    if (data.email) {
      setProfileEmail(data.email);
    }

    if (data.avatar) {
      setProfileImage(`data:image/png;base64,${data.avatar}`);
    } else {
      setProfileImage(defaultProfile);
    }

    if (data.rank?.rank_Name) {
      setRankName(data.rank.rank_Name);
    } else {
      setRankName("Aucun rang");
    }

    if (data.rank?.image_Rank) {
      setRankImage(`data:image/png;base64,${data.rank.image_Rank}`);
    } else {
      setRankImage(null);
    }
  };

  const fetchMySongSuggestions = async (token: string) => {
    setIsSuggestionsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/music-suggestions/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "Impossible de récupérer tes propositions."
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        setSongSuggestions([]);
        return;
      }

      setSongSuggestions(data.map(mapApiSuggestionToFront));
    } catch (error) {
      console.error("Erreur chargement suggestions :", error);
      setSongSuggestions([]);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du chargement des propositions.",
      });
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe");
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();

    if (storedRememberMe === "true") {
      setRememberMe(true);
    }

    if (accessToken && refreshToken && isTokenValid(accessToken)) {
      const payload = parseJwt(accessToken);

      if (payload) {
        const userId = getClaimUserId(payload);

        applyProfileFromToken(accessToken, setUsername, setProfileEmail);
        setIsLoggedIn(true);
        setView("profile");

        if (userId) {
          fetchUserProfile(userId, accessToken).catch((error) => {
            console.error("Erreur chargement profil :", error);
          });
        }

        fetchMySongSuggestions(accessToken).catch((error) => {
          console.error("Erreur chargement suggestions :", error);
        });
      }

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
    setRankName("Aucun rang");
    setRankImage(null);
    setSongSuggestions([]);
  };

  const resetLoginState = () => {
    setEmail("");
    setPassword("");
    setLoginError("");
    setRememberMe(false);
  };

  const handleProfileImageChange = async (file: File | null) => {
    if (!file) return;

    const previousImage = profileImage;
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

      const avatarBase64 = await fileToBase64(file);

      const formData = new FormData();
      formData.append("Id_User", String(userId));
      formData.append("Username", username);
      formData.append("Avatar", avatarBase64);
      formData.append("Id_Rank", "1");
      formData.append("Id_Role", String(getClaimRoleId(payload)));
      formData.append("Elo", "0");

      const updateResponse = await fetch(
        `${API_URL}/api/users/update/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(
          errorText || "Erreur lors de la mise à jour de l'avatar."
        );
      }

      const newAccessToken = await refreshSession(setUsername, setProfileEmail);
      await fetchUserProfile(userId, newAccessToken);
      window.dispatchEvent(new Event("authChanged"));

      notifySuccess({
        title: "Avatar mis à jour",
        message: "Ta photo de profil a bien été modifiée.",
      });
    } catch (error) {
      setProfileImage(previousImage);
      console.error("Erreur mise à jour avatar :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la mise à jour de l'avatar.",
      });
    } finally {
      URL.revokeObjectURL(imageUrl);
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
      const currentAvatarBase64 = extractBase64FromImageSrc(profileImage);

      if (!userId) {
        throw new Error(
          "Impossible de récupérer l'identifiant utilisateur depuis le token."
        );
      }

      const formData = new FormData();
      formData.append("Id_User", userId);
      formData.append("Username", username);
      formData.append("Avatar", currentAvatarBase64);
      formData.append("Id_Rank", "1");
      formData.append("Id_Role", getClaimRoleId(payload));
      formData.append("Elo", "0");

      const updateResponse = await fetch(
        `${API_URL}/api/users/update/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(errorText || "Erreur lors de la mise à jour du profil.");
      }

      const newAccessToken = await refreshSession(setUsername, setProfileEmail);
      await fetchUserProfile(userId, newAccessToken);
      window.dispatchEvent(new Event("authChanged"));

      notifySuccess({
        title: "Profil mis à jour",
        message: "Tes informations ont bien été enregistrées.",
      });
    } catch (error) {
      console.error("Erreur mise à jour profil :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la mise à jour du profil.",
      });
    }
  };

  const handleSubmitSongSuggestion = async (data: SuggestionFormData) => {
    try {
      const token = getStoredAccessToken();
    
      if (!token) {
        throw new Error("Tu dois être connecté pour proposer une musique.");
      }
    
      const response = await fetch(`${API_URL}/api/music-suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          artist_Name: data.artist,
          Album_Name: data.album?.trim() || "",
          message: data.message ?? "",
        }),
      });
    
      if (!response.ok) {
        let userMessage = "Impossible d'envoyer la proposition.";
      
        try {
          const errorData = await response.json();
        
          if (
            typeof errorData?.message === "string" &&
            errorData.message.toLowerCase().includes("limite")
          ) {
            userMessage =
              "Tu as déjà 5 propositions en attente cette semaine. Attends qu’une proposition soit traitée avant d’en envoyer une nouvelle.";
          } else if (errorData?.errors) {
            if (errorData.errors.Album_Name?.length) {
              userMessage = "Merci de renseigner l’album.";
            } else if (errorData.errors.artist_Name?.length) {
              userMessage = "Merci de renseigner l’artiste.";
            } else if (errorData.errors.title?.length) {
              userMessage = "Merci de renseigner le titre.";
            } else {
              userMessage =
                "Certains champs sont invalides. Vérifie les informations saisies.";
            }
          } else if (typeof errorData?.title === "string") {
            userMessage = errorData.title;
          }
        } catch {
          const errorText = await response.text();
        
          if (errorText.toLowerCase().includes("limite")) {
            userMessage =
              "Tu as déjà 5 propositions en attente cette semaine. Attends qu’une proposition soit traitée avant d’en envoyer une nouvelle.";
          }
        }
      
        throw new Error(userMessage);
      }
    
      notifySuccess({
        title: "Proposition envoyée",
        message: "Ta suggestion a bien été enregistrée.",
      });
    
      try {
        await fetchMySongSuggestions(token);
      } catch (error) {
        console.error("Erreur rafraîchissement suggestions :", error);
      }
    } catch (error) {
      console.error("Erreur envoi suggestion :", error);
    
      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'envoi de la proposition.",
      });
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    setIsLoginLoading(true);

    if (!canSubmitLogin(email, password)) {
      setLoginError("Merci de renseigner un email valide et un mot de passe.");
      setIsLoginLoading(false);
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

      const payload = parseJwt(data.accessToken);
      const userId = payload ? getClaimUserId(payload) : "";

      if (userId) {
        await fetchUserProfile(userId, data.accessToken);
      }

      await fetchMySongSuggestions(data.accessToken);

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
      resetProfileState();
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
      window.dispatchEvent(new Event("authChanged"));

      notifySuccess({
        title: "Compte supprimé",
        message: "Ton compte a bien été supprimé.",
      });
    } catch (error) {
      console.error("Erreur suppression compte :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la suppression du compte.",
      });
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
        rankName={rankName}
        rankImage={rankImage}
        resetRef={resetRef}
        onProfileImageChange={handleProfileImageChange}
        onGoToChangePassword={() => setView("change-password")}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onSaveProfile={handleSaveProfile}
        onSubmitSongSuggestion={handleSubmitSongSuggestion}
        songSuggestions={songSuggestions}
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