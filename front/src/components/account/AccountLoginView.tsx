import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  Text,
  Title,
  Alert,
} from "@mantine/core";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../inputs/FloatingLabelInput";
import PasswordBasic from "../inputs/PasswordBasic";
import { canSubmitLogin } from "../../utils/accountValidation";

type AccountLoginViewProps = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  loginError: string;
  isLoginLoading: boolean;
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
  onLogin: () => void;
};


export default function AccountLoginView({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  loginError,
  isLoginLoading,
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
        {loginError && (
          <Alert color="red" mb="md">
            {loginError}
          </Alert>
        )}

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

        <Group justify="space-between" mt={15}>
          <Checkbox
            label="Se souvenir de moi"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />

          <Anchor
            component="button"
            size="sm"
            c="red"
            onClick={onGoToForgotPassword}
          >
            Mot de passe oublié ?
          </Anchor>
        </Group>

        <Button
          fullWidth
          mt={20}
          radius="md"
          onClick={onLogin}
          loading={isLoginLoading}
          disabled={!canSubmitLogin(email, password) || isLoginLoading}
        >
          Se connecter
        </Button>
        
      </Paper>
    </Container>
  );
}