import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Anchor,
  Paper,
  Group,
  Checkbox,
  Button,
} from "@mantine/core";
import classes from "../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../components/inputs/FloatingLabelInput";
import PasswordStrength from "../components/inputs/PasswordStrength";
import PasswordBasic from "../components/inputs/PasswordBasic";

type AccountView = "login" | "register" | "profile";

export default function Account() {

  // À changer plus tard par la connexion
  const [isLoggedIn, setIsLoggedIn] = useState(false); //false true pour le changement vue

  // Vue affichée quand pas connecté
  const [view, setView] = useState<AccountView>("login");

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  // Profile
  const [profileEmail, setProfileEmail] = useState("exemple@exemple.com");
  const [username, setUsername] = useState("Mon pseudo");

  //Vue profil connecté
  if (isLoggedIn || view === "profile") {
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Mon compte
        </Title>

        <Text className={classes.subtitle}>
          Modifiez vos informations personnelles
        </Text>

        <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
          <FloatingLabelInput
            mb={23}
            label="Pseudo"
            placeholder="Votre pseudo"
            value={username}
            onChange={setUsername}
            required
          />

          <FloatingLabelInput
            mb={23}
            label="Email"
            placeholder="exemple@exemple.com"
            value={profileEmail}
            onChange={setProfileEmail}
            required
          />

          <Button fullWidth mt="xl" radius="md">
            Enregistrer les modifications
          </Button>

          <Button
            fullWidth
            mt="md"
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
        </Paper>
      </Container>
    );
  }

  //Vue création de compte
  if (view === "register") {
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Créer un compte !
        </Title>

        <Text className={classes.subtitle}>
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
            label="Mot de passe"
            placeholder="Mot de passe"
            value={registerPassword}
            onChange={setRegisterPassword}
            required
          />

          <PasswordBasic
            mt={23}
            label="Confirmer le mot de passe"
            placeholder="Confirmer le mot de passe"
            value={registerPasswordConfirm}
            onChange={setRegisterPasswordConfirm}
            required
          />

          <Button
            fullWidth
            mt="xl"
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

  //Vue par défaut connexion
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Connectez vous !
      </Title>

      <Text className={classes.subtitle}>
        Vous n'avez pas de compte ?{" "}
        <Anchor
          component="button"
          type="button"
          onClick={() => setView("register")}
        >
          Créer un compte
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        <FloatingLabelInput
          mb={23}
          label="Email"
          placeholder="exemple@exemple.com"
          value={email}
          onChange={setEmail}
          required
        />

        <PasswordBasic
          label="Mot de passe"
          placeholder="Mot de passe"
          value={password}
          onChange={setPassword}
          required
        />

        <Group justify="space-between" mt="lg">
          <Checkbox label="Se souvenir de moi" />
          <Anchor component="button" size="sm">
            Mot de passe oublié ?
          </Anchor>
        </Group>

        <Button
          fullWidth
          mt="xl"
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
