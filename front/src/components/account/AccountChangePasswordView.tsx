import {
  Anchor,
  Button,
  Container,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import PasswordBasic from "../inputs/PasswordBasic";
import PasswordStrength from "../inputs/PasswordStrength";

type AccountChangePasswordViewProps = {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (value: string) => void;
  onBackToProfile: () => void;
};

export default function AccountChangePasswordView({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  onBackToProfile,
}: AccountChangePasswordViewProps) {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Réinitialiser le mot de passe
      </Title>

      <Text className={classes.subtitle} ta="center">
        Modifiez votre mot de passe
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        <PasswordBasic
          mb={25}
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

        <Button fullWidth mt="xl" radius="md">
          Enregistrer le nouveau mot de passe
        </Button>

        <Text ta="center" mt="md">
          <Anchor component="button" type="button" onClick={onBackToProfile}>
            Retour au profil
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}