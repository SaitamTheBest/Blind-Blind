export type PasswordRuleCheck = {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

export function getPasswordChecks(password: string): PasswordRuleCheck {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
}

export function isPasswordStrong(password: string): boolean {
  const checks = getPasswordChecks(password);

  return (
    checks.minLength &&
    checks.hasUppercase &&
    checks.hasLowercase &&
    checks.hasNumber &&
    checks.hasSpecialChar
  );
}

export function getPasswordError(password: string): string {
  if (!password.trim()) return "Le mot de passe est requis.";
  if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
  if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule.";
  if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une minuscule.";
  if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Le mot de passe doit contenir au moins un caractère spécial.";

  return "";
}