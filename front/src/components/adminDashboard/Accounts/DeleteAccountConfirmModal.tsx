import { Button, Group, Modal, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import type { Player } from "./AccountsTable";

type DeleteAccountConfirmModalProps = {
  opened: boolean;
  player: Player | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteAccountConfirmModal({
  opened,
  player,
  loading = false,
  onClose,
  onConfirm,
}: DeleteAccountConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={loading ? () => {} : onClose}
      centered
      radius="md"
      title={null}
      withCloseButton={!loading}
      size="md"
    >
      <Stack gap="md">
        <Group align="flex-start" wrap="nowrap">
          <ThemeIcon color="red" variant="light" size={46} radius="xl">
            <IconAlertTriangle size={24} />
          </ThemeIcon>

          <Stack gap={4}>
            <Title order={3}>Supprimer ce compte ?</Title>

            <Text size="sm" c="dimmed">
              Cette action est définitive. Le compte sera supprimé de la base et
              ne pourra pas être restauré depuis le dashboard.
            </Text>
          </Stack>
        </Group>

        <Text size="sm">
          Compte concerné :{" "}
          <Text span fw={700}>
            {player?.pseudo ?? "Utilisateur inconnu"}
          </Text>
        </Text>

        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Annuler
          </Button>

          <Button
            color="red"
            leftSection={<IconTrash size={16} />}
            loading={loading}
            onClick={onConfirm}
          >
            Supprimer définitivement
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}