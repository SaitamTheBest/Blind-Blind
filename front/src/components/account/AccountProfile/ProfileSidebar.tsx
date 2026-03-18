import React from "react";
import {
  Avatar,
  Button,
  Card,
  FileButton,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconLogout,
  IconMusic,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import classes from "../../../styles/account/AuthenticationTitle.module.css";

type ProfileSidebarProps = {
  username: string;
  profileImage: string;
  resetRef: React.MutableRefObject<(() => void) | null>;
  onProfileImageChange: (file: File | null) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export default function ProfileSidebar({
  username,
  profileImage,
  resetRef,
  onProfileImageChange,
  onLogout,
  onDeleteAccount,
}: ProfileSidebarProps) {
  return (
    <Paper
      radius="xl"
      p="xl"
      withBorder
      shadow="sm"
      className={classes.sidebar}
    >
      <Stack h="100%" align="center" gap="lg">
        <div className={classes.avatarSection}>
          <FileButton
            resetRef={resetRef}
            onChange={onProfileImageChange}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          >
            {(props) => (
              <div className={classes.avatarWrapper} {...props}>
                <Avatar
                  src={profileImage}
                  size={140}
                  radius={140}
                  className={classes.avatar}
                />
                <div className={classes.avatarOverlay}>
                  <Stack gap={4} align="center">
                    <IconUpload size={22} />
                    <Text size="xs" fw={600}>
                      Changer la photo
                    </Text>
                  </Stack>
                </div>
              </div>
            )}
          </FileButton>
        </div>
        
        <Stack gap={4} align="center">
          <Title order={2} className={classes.username}>
            {username || "Pseudo"}
          </Title>
          <Text c="dimmed" fs="italic" size="sm">
            Ton espace perso
          </Text>
        </Stack>
        
        <Card radius="xl" padding="lg" withBorder className={classes.rankCard}>
          <Group wrap="nowrap" align="center">
            <ThemeIcon size={52} radius="xl" variant="light" color="yellow">
              <IconMusic size={28} />
            </ThemeIcon>
        
            <div>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Rang actuel
              </Text>
              <Text fw={700} size="lg">
                RANG_NOM
              </Text>
            </div>
          </Group>
        </Card>
        
        <Stack w="100%" gap="sm" mt="auto">
          <Button
            fullWidth
            radius="xl"
            size="md"
            variant="light"
            color="red"
            leftSection={<IconLogout size={18} />}
            onClick={onLogout}
          >
            Se déconnecter
          </Button>
        
          <Button
            fullWidth
            mt="md"
            radius="xl"
            size="md"
            variant="outline"
            color="red"
            leftSection={<IconTrash size={18} />}
            onClick={onDeleteAccount}
          >
            Supprimer le compte
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}