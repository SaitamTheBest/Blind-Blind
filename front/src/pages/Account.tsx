import { useEffect, useRef, useState } from "react";
import AccountLoginView from "../components/account/AccountLoginView";
import AccountRegisterView from "../components/account/AccountRegisterView";
import AccountForgotPasswordView from "../components/account/AccountForgotPasswordView";
import AccountProfileView from "../components/account/AccountProfileView";
import AccountChangePasswordView from "../components/account/AccountChangePasswordView";
import defaultProfile from "../res/default_profil.svg";

export type AccountView =
  | "login"
  | "register"
  | "forgot-password"
  | "profile"
  | "change-password";

type JwtPayload = {
  exp?: number;
  email?: string;
  role?: string;
  nameid?: string;
  unique_name?: string;
  username?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
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

function getClaimEmail(payload: JwtPayload): string {
  return (
    payload.email ||
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
    ""
  );
}

function getClaimUserId(payload: JwtPayload): string {
  return (
    payload.nameid ||
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    ""
  );
}

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<AccountView>("login");

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

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
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setView("login");
      return;
    }

    if (!isTokenValid(token)) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setView("login");
      return;
    }

    const payload = parseJwt(token);

    if (payload) {
      const tokenEmail = getClaimEmail(payload);

      if (tokenEmail) {
        setEmail(tokenEmail);
        setProfileEmail(tokenEmail);
      }
    }

    setIsLoggedIn(true);
    setView("profile");
  }, []);

  const handleProfileImageChange = (file: File | null) => {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleLogin = async () => {
    setLoginError("");

    if (!email.trim() || !password.trim()) {
      setLoginError("Merci de remplir l'email et le mot de passe.");
      return;
    }

    try {
      setIsLoginLoading(true);

      const response = await fetch("http://localhost:5004/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Email ou mot de passe incorrect.");
      }

      const result = await response.json();
      const token = result.token || result.Token || result.accessToken;

      if (!token) {
        throw new Error("Aucun token renvoyé par l'API.");
      }

      localStorage.setItem("token", token);

      const payload = parseJwt(token);

      if (payload) {
        const tokenEmail = getClaimEmail(payload);

        if (tokenEmail) {
          setEmail(tokenEmail);
          setProfileEmail(tokenEmail);
        }
      } else {
        setProfileEmail(email);
      }

      setIsLoggedIn(true);
      setView("profile");
      setPassword("");
    } catch (error) {
      console.error("Erreur connexion :", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterError("");
    setRegisterSuccess("");

    if (!registerEmail.trim() || !registerUsername.trim() || !registerPassword.trim()) {
      setRegisterError("Merci de remplir tous les champs.");
      return;
    }

    if (registerPassword !== registerPasswordConfirm) {
      setRegisterError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setIsRegisterLoading(true);

      const formData = new FormData();
      formData.append("Email", registerEmail);
      formData.append("Password", registerPassword);
      formData.append("User.Username", registerUsername);
      formData.append("User.Avatar", "");

      const response = await fetch("http://localhost:5004/api/users/create", {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setView("login");
    setPassword("");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Es-tu sûr de vouloir supprimer définitivement ton compte ?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Aucun token trouvé.");
      }

      const payload = parseJwt(token);

      if (!payload) {
        throw new Error("Token invalide.");
      }

      const userId = getClaimUserId(payload);

      if (!userId) {
        throw new Error("Impossible de récupérer l'identifiant utilisateur depuis le token.");
      }

      const response = await fetch(`http://localhost:5004/api/users/delete/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de la suppression du compte.");
      }

      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setView("login");
      setUsername("John Doe");
      setProfileEmail("john@doe.com");
      setProfileImage(defaultProfile);
      setEmail("");
      setPassword("");

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
        onSaveProfile={() => {
          console.log("Profil sauvegardé");
        }}
        onSubmitSongSuggestion={(data) => {
          console.log("Nouvelle proposition :", data);
        }}
        songSuggestions={[
          { id: 1, title: "Numb", artist: "Linkin Park", status: "accepted" },
          { id: 2, title: "Blinding Lights", artist: "The Weeknd", status: "pending" },
          { id: 3, title: "Believer", artist: "Imagine Dragons", status: "rejected" },
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
      loginError={loginError}
      isLoginLoading={isLoginLoading}
      onGoToRegister={() => setView("register")}
      onGoToForgotPassword={() => setView("forgot-password")}
      onLogin={handleLogin}
    />
  );
}