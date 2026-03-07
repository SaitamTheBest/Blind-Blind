import { useRef, useState } from "react";
import { IconPencil } from "@tabler/icons-react";
import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  Text,
  Title,
  Avatar,
  Stack,
  FileButton,
} from "@mantine/core";
import classes from "../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../components/inputs/FloatingLabelInput";
import PasswordBasic from "../components/inputs/PasswordBasic";
import PasswordStrength from "../components/inputs/PasswordStrength";
import defaultProfile from "../res/default_profil.svg";

type AccountView = "login" | "register" | "forgot-password" | "profile" | "change-password";

export default function Account() {
  // À remplacer plus tard par la vraie auth
  const [isLoggedIn, setIsLoggedIn] = useState(true); //false true pour le changement vue
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

  // Demande changement mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const resetRef = useRef<() => void>(null);

  const handleProfileImageChange = (file: File | null) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  //Vue changement de mot de passe
  if (view === "change-password") {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Changer le mot de passe
      </Title>

      <Text className={classes.subtitle} ta="center">
        Modifiez votre mot de passe en toute sécurité
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        <PasswordBasic
          mb={23}
          label="Mot de passe actuel"
          placeholder="Mot de passe actuel"
          value={currentPassword}
          onChange={setCurrentPassword}
          required
        />

        <PasswordStrength
          mb={10}
          label="Nouveau mot de passe"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={setNewPassword}
          required
        />

        <PasswordBasic
          mt={25}
          label="Confirmer le nouveau mot de passe"
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmNewPassword}
          onChange={setConfirmNewPassword}
          required
        />

        <Button fullWidth mt="lg" radius="md">
          Enregistrer le nouveau mot de passe
        </Button>

        <Text ta="center" mt="md">
          <Anchor
            component="button"
            type="button"
            onClick={() => setView("profile")}
          >
            Retour au profil
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}

  // Vue mot de passe oublié
  if (view === "forgot-password") {
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Mot de passe oublié
        </Title>

        <Text className={classes.subtitle} ta="center">
          Entrez votre email pour faire une demande de réinitialisation
        </Text>

        <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
          <FloatingLabelInput
            label="Email"
            placeholder="exemple@email.com"
            value={forgotEmail}
            onChange={setForgotEmail}
            required
          />

          <Button fullWidth mt="lg" radius="md">
            Envoyer la demande
          </Button>

          <Text ta="center" mt="md">
            <Anchor
              component="button"
              type="button"
              onClick={() => setView("login")}
            >
              Retour à la connexion
            </Anchor>
          </Text>
        </Paper>
      </Container>
    );
  }

  // Vue création de compte
  if (view === "register") {
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Créer un compte !
        </Title>

        <Text className={classes.subtitle} ta="center">
          Vous avez déjà un compte ?{" "}
          <Anchor
            component="button"
            type="button"
            onClick={() => setView("login")}
          >
            Se connecter
          </Anchor>
        </Text>

        <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
          <FloatingLabelInput
            mb={23}
            label="Email"
            placeholder="exemple@exemple.com"
            value={registerEmail}
            onChange={setRegisterEmail}
            required
          />

          <PasswordStrength
            mb={10}
            label="Mot de passe"
            placeholder="Mot de passe"
            value={registerPassword}
            onChange={setRegisterPassword}
            required
          />

          <PasswordBasic
            mt={25}
            label="Confirmer le mot de passe"
            placeholder="Confirmer le mot de passe"
            value={registerPasswordConfirm}
            onChange={setRegisterPasswordConfirm}
            required
          />

          <Button
            fullWidth
            mt="lg"
            radius="md"
            onClick={() => {
              setEmail(registerEmail);
              setPassword("");
              setView("login");
            }}
          >
            Créer un compte
          </Button>
        </Paper>
      </Container>
    );
  }

  // Vue profil
  if (isLoggedIn || view === "profile") {
    return (
      <Container size={460} my={40}>
        <Title ta="center" className={classes.title}>
          Mon profil
        </Title>

        <Paper withBorder shadow="sm" p={30} mt={10} radius="md">
          <Stack gap="md">
            <Group justify="center">
              <FileButton
                resetRef={resetRef}
                onChange={handleProfileImageChange}
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              >
                {(props) => (
                  <div className={classes.avatarWrapper} {...props}>
                    <Avatar
                      src={profileImage}
                      size={110}
                      radius="100"
                    />

                    <div className={classes.avatarOverlay}>
                      <IconPencil size={24} />
                    </div>
                  </div>
                )}
              </FileButton>
            </Group>

            <FloatingLabelInput
              mt={5}
              label="Pseudo"
              placeholder="Votre pseudo"
              value={username}
              onChange={setUsername}
              required
            />

            <FloatingLabelInput
              mt={10}
              label="Email"
              placeholder="exemple@email.com"
              value={profileEmail}
              onChange={setProfileEmail}
              required
            />

            <Text ta="left" mt={-5}>
              <Anchor
                component="button"
                type="button"
                c="red"
                onClick={() => setView("change-password")}
              >
                Réinitialiser le mot de passe
              </Anchor>
            </Text>

            <Button fullWidth radius="md">
              Enregistrer les modifications
            </Button>

            <Button
              fullWidth
              radius="md"
              variant="light"
              color="red"
              onClick={() => {
                setIsLoggedIn(false);
                setView("login");
              }}
            >
              Se déconnecter
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Vue connexion
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Connectez vous !
      </Title>

      <Text className={classes.subtitle} ta="center">
        Vous n'avez pas de compte ?{" "}
        <Anchor
          component="button"
          type="button"
          onClick={() => setView("register")}
        >
          Créer un compte
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">

        <FloatingLabelInput
          mt={5}
          label="Email"
          placeholder="you@mantine.dev"
          value={email}
          onChange={setEmail}
          required
        />

        <PasswordBasic
          mt={25}
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={setPassword}
          required
        />

        <Group justify="space-between" mt={10}>
          <Anchor
            component="button"
            size="sm"
            onClick={() => setView("forgot-password")}
          >
            Mot de passe oublié ?
          </Anchor>
        </Group>

        <Button
          fullWidth
          mt="lg"
          radius="md"
          onClick={() => {
            setIsLoggedIn(true);
            setView("profile");
          }}
        >
          Se connecter
        </Button>
      </Paper>
    </Container>
  );


  
}