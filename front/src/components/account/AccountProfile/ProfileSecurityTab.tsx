import { Button, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconChevronRight, IconLock, IconTrash } from "@tabler/icons-react";
import classes from "../../../styles/account/AuthenticationTitle.module.css";

type ProfileSecurityTabProps = {
  onGoToChangePassword: () => void;
  onDeleteAccount: () => void;
};

export default function ProfileSecurityTab({
  onGoToChangePassword,
  onDeleteAccount,
}: ProfileSecurityTabProps) {
  return (
    <Stack gap="md">
      <div>
        <Title order={3}>Sécurité</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Gère les options liées à ton compte.
        </Text>
      </div>

      <Paper radius="lg" p="md" withBorder className={classes.innerCard}>
        <Group justify="space-between" align="center">
          <Group>
            <ThemeIcon variant="light" color="red" radius="xl">
              <IconLock size={18} />
            </ThemeIcon>
            <div>
              <Text fw={600}>Mot de passe</Text>
              <Text size="sm" c="dimmed">
                Change ou réinitialise ton mot de passe
              </Text>
            </div>
          </Group>

          <Button
            variant="subtle"
            rightSection={<IconChevronRight size={16} />}
            onClick={onGoToChangePassword}
          >
            Réinitialiser
          </Button>
        </Group>
      </Paper>

      <Paper radius="lg" p="md" withBorder className={classes.dangerZone}>
        <Stack gap="xs">
          <Text fw={700} c="red">
            Suppression du compte
          </Text>
          <Text size="sm" c="dimmed">
            La suppression du compte est irréversible. Une fois lancé,
            retour arrière impossible.
          </Text>

          <Group justify="flex-end" mt="sm">
            <Button
              radius="xl"
              color="red"
              variant="outline"
              leftSection={<IconTrash size={16} />}
              onClick={onDeleteAccount}
            >
              Supprimer définitivement mon compte
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}