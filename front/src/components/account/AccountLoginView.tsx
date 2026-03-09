import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../inputs/FloatingLabelInput";
import PasswordBasic from "../inputs/PasswordBasic";

type AccountLoginViewProps = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
  onLogin: () => void;
};

export default function AccountLoginView({
  email,
  setEmail,
  password,
  setPassword,
  onGoToRegister,
  onGoToForgotPassword,
  onLogin,
}: AccountLoginViewProps) {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Connectez vous !
      </Title>

      <Text className={classes.subtitle} ta="center">
        Vous n'avez pas de compte ?{" "}
        <Anchor component="button" type="button" onClick={onGoToRegister}>
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
          label="Mot de passe"
          placeholder="Mot de passe"
          value={password}
          onChange={setPassword}
          required
        />

        <Group justify="space-between" mt={5}>
          <Anchor component="button" size="sm" c="red" onClick={onGoToForgotPassword}>
            Mot de passe oublié ?
          </Anchor>
        </Group>

        <Button fullWidth mt={20} radius={"md"} onClick={onLogin}>
          Se connecter
        </Button>
      </Paper>
    </Container>
  );
}