import {
  Anchor,
  Button,
  Container,
  Paper,
  Text,
  Title,
  Alert,
} from "@mantine/core";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../inputs/FloatingLabelInput";
import PasswordBasic from "../inputs/PasswordBasic";
import PasswordStrength from "../inputs/PasswordStrength";

type AccountRegisterViewProps = {
  registerEmail: string;
  setRegisterEmail: (value: string) => void;
  registerUsername: string;
  setRegisterUsername: (value: string) => void;
  registerPassword: string;
  setRegisterPassword: (value: string) => void;
  registerPasswordConfirm: string;
  setRegisterPasswordConfirm: (value: string) => void;
  registerError: string;
  registerSuccess: string;
  isRegisterLoading: boolean;
  onGoToLogin: () => void;
  onRegister: () => void;
};

export default function AccountRegisterView({
  registerEmail,
  setRegisterEmail,
  registerUsername,
  setRegisterUsername,
  registerPassword,
  setRegisterPassword,
  registerPasswordConfirm,
  setRegisterPasswordConfirm,
  registerError,
  registerSuccess,
  isRegisterLoading,
  onGoToLogin,
  onRegister,
}: AccountRegisterViewProps) {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Créer un compte !
      </Title>

      <Text className={classes.subtitle} ta="center">
        Vous avez déjà un compte ?{" "}
        <Anchor component="button" type="button" onClick={onGoToLogin}>
          Se connecter
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        {registerError && (
          <Alert color="red" mb="md">
            {registerError}
          </Alert>
        )}

        {registerSuccess && (
          <Alert color="green" mb="md">
            {registerSuccess}
          </Alert>
        )}

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

        <FloatingLabelInput
          mt={25}
          label="Pseudo"
          placeholder="Votre pseudo"
          value={registerUsername}
          onChange={setRegisterUsername}
          required
        />

        <Button
          fullWidth
          mt="xl"
          radius="md"
          onClick={onRegister}
          loading={isRegisterLoading}
        >
          Créer un compte
        </Button>
      </Paper>
    </Container>
  );
}