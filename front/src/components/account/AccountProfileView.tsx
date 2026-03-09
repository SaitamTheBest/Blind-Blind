import {
  Anchor,
  Avatar,
  Button,
  Container,
  FileButton,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../inputs/FloatingLabelInput";

type AccountProfileViewProps = {
  username: string;
  setUsername: (value: string) => void;
  profileEmail: string;
  setProfileEmail: (value: string) => void;
  profileImage: string;
  resetRef: React.MutableRefObject<(() => void) | null>;
  onProfileImageChange: (file: File | null) => void;
  onGoToChangePassword: () => void;
  onLogout: () => void;
};

export default function AccountProfileView({
  username,
  setUsername,
  profileEmail,
  setProfileEmail,
  profileImage,
  resetRef,
  onProfileImageChange,
  onGoToChangePassword,
  onLogout,
}: AccountProfileViewProps) {
  return (
    <Container size={460} my={40}>
      <Title ta="center" className={classes.title}>
        Mon profil
      </Title>

      <Text className={classes.subtitle} ta="center">
        Modifiez vos informations personnelles
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        <Stack gap="md">
          <Group justify="center">
            <FileButton
              resetRef={resetRef}
              onChange={onProfileImageChange}
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            >
              {(props) => (
                <div className={classes.avatarWrapper} {...props}>
                  <Avatar src={profileImage} size={110} radius="xl" />
                  <div className={classes.avatarOverlay}>
                    <IconPencil size={24} />
                  </div>
                </div>
              )}
            </FileButton>
          </Group>

          <FloatingLabelInput
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

          <Text ta="start" mt={-5}>
            <Anchor
              component="button"
              type="button"
              c="red"
              onClick={onGoToChangePassword}
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
            onClick={onLogout}
          >
            Se déconnecter
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}