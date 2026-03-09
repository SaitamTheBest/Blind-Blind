import { useRef, useState } from "react";
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

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); //true false changement de vue 
  const [view, setView] = useState<AccountView>("login");

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

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

  const handleProfileImageChange = (file: File | null) => {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
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
        registerPassword={registerPassword}
        setRegisterPassword={setRegisterPassword}
        registerPasswordConfirm={registerPasswordConfirm}
        setRegisterPasswordConfirm={setRegisterPasswordConfirm}
        onGoToLogin={() => setView("login")}
        onRegister={() => {
          setEmail(registerEmail);
          setPassword("");
          setView("login");
        }}
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
        onLogout={() => {
          setIsLoggedIn(false);
          setView("login");
        }}
      />
    );
  }

  return (
    <AccountLoginView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onGoToRegister={() => setView("register")}
      onGoToForgotPassword={() => setView("forgot-password")}
      onLogin={() => {
        setIsLoggedIn(true);
        setView("profile");
      }}
    />
  );
}