import {
  Anchor,
  Button,
  Container,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../inputs/FloatingLabelInput";
import { canSubmitForgotPassword } from "../../utils/accountValidation";

type AccountForgotPasswordViewProps = {
  forgotEmail: string;
  setForgotEmail: (value: string) => void;
  onBackToLogin: () => void;
};

export default function AccountForgotPasswordView({
  forgotEmail,
  setForgotEmail,
  onBackToLogin,
}: AccountForgotPasswordViewProps) {
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

        <Button fullWidth mt="xl" radius="md" disabled={!canSubmitForgotPassword(forgotEmail)}>
          Envoyer la demande
        </Button>

        <Text ta="center" mt="md">
          <Anchor component="button" type="button" onClick={onBackToLogin}>
            Retour à la connexion
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}