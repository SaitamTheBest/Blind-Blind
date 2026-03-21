import { getPasswordError, isPasswordStrong } from "./passwordValidation";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getEmailError(email: string): string {
  if (!email.trim()) return "L'email est requis.";
  if (!isValidEmail(email)) return "Le format de l'email est invalide.";
  return "";
}

export function isValidUsername(username: string): boolean {
  const value = username.trim();
  return value.length >= 3 && value.length <= 20;
}

export function getUsernameError(username: string): string {
  const value = username.trim();

  if (!value) return "Le pseudo est requis.";
  if (value.length < 3) return "Le pseudo doit contenir au moins 3 caractères.";
  if (value.length > 20) return "Le pseudo doit contenir au maximum 20 caractères.";

  return "";
}

export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

export function getConfirmPasswordError(password: string, confirmPassword: string): string {
  if (!confirmPassword.trim()) return "La confirmation du mot de passe est requise.";
  if (password !== confirmPassword) return "Les mots de passe ne correspondent pas.";
  return "";
}

export function canSubmitLogin(email: string, password: string): boolean {
  return isValidEmail(email) && password.trim().length > 0;
}

export function canSubmitForgotPassword(email: string): boolean {
  return isValidEmail(email);
}

export function canSubmitRegister(
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): boolean {
  return (
    isValidEmail(email) &&
    isValidUsername(username) &&
    isPasswordStrong(password) &&
    doPasswordsMatch(password, confirmPassword)
  );
}

export function canSubmitChangePassword(
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): boolean {
  return (
    currentPassword.trim().length > 0 &&
    isPasswordStrong(newPassword) &&
    doPasswordsMatch(newPassword, confirmNewPassword)
  );
}

export function getRegisterFormError(
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): string {
  return (
    getEmailError(email) ||
    getUsernameError(username) ||
    getPasswordError(password) ||
    getConfirmPasswordError(password, confirmPassword)
  );
}

export function getChangePasswordFormError(
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): string {
  if (!currentPassword.trim()) {
    return "Le mot de passe actuel est requis.";
  }

  return (
    getPasswordError(newPassword) ||
    getConfirmPasswordError(newPassword, confirmNewPassword)
  );
}