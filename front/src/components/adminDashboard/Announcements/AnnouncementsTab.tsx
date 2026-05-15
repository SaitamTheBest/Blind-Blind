import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconPlus,
  IconSearch,
  IconSpeakerphone,
} from "@tabler/icons-react";
import AnnouncementFormModal from "./AnnouncementFormModal";
import AnnouncementList from "./AnnouncementList";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getAnnouncementTypes,
  updateAnnouncement,
} from "./api";
import type {
  Announcement,
  AnnouncementType,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "./types";
import { notifyError, notifySuccess } from "../../../utils/notify";

function getReadableErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message?.trim();

  if (!message) {
    return fallback;
  }

  if (
    message.includes("401") ||
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("non autorisé") ||
    message.toLowerCase().includes("session expirée")
  ) {
    return "Votre session a expiré ou vous n'avez pas les droits nécessaires. Reconnectez-vous.";
  }

  return message;
}

export default function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementTypes, setAnnouncementTypes] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [search, setSearch] = useState("");

  const loadData = async (showNotificationOnError = true) => {
    try {
      setLoading(true);

      const [announcementsData, typesData] = await Promise.all([
        getAnnouncements(),
        getAnnouncementTypes(),
      ]);

      setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
      setAnnouncementTypes(Array.isArray(typesData) ? typesData : []);
    } catch (error) {
      const message = getReadableErrorMessage(
        error,
        "Impossible de charger les annonces."
      );

      if (showNotificationOnError) {
        notifyError({
          title: "Chargement impossible",
          message,
        });
      }

      setAnnouncements([]);
      setAnnouncementTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return announcements;
    }

    return announcements.filter((announcement) => {
      return (
        announcement.title?.toLowerCase().includes(normalizedSearch) ||
        announcement.short_Description?.toLowerCase().includes(normalizedSearch) ||
        announcement.slug?.toLowerCase().includes(normalizedSearch) ||
        announcement.announcement_Type?.label?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [announcements, search]);

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setOpened(true);
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setOpened(true);
  };

  const handleCloseModal = () => {
    setOpened(false);
    setEditingAnnouncement(null);
  };

  const handleSubmit = async (
    values: CreateAnnouncementPayload | UpdateAnnouncementPayload
  ) => {
    try {
      setSaving(true);

      if ("id_Announcement" in values) {
        await updateAnnouncement(values);

        notifySuccess({
          title: "Annonce modifiée",
          message: "Les modifications ont bien été enregistrées.",
        });
      } else {
        await createAnnouncement(values);

        notifySuccess({
          title: "Annonce créée",
          message: "L'annonce a bien été créée.",
        });
      }

      handleCloseModal();
      await loadData(false);
    } catch (error) {
      const message = getReadableErrorMessage(
        error,
        "Impossible d'enregistrer l'annonce."
      );

      notifyError({
        title: "Enregistrement impossible",
        message,
      });
    } finally {
      setSaving(false);
    }
    console.log("SUBMIT TRIGGERED", values);
  };

  const handleDelete = (announcement: Announcement) => {
    modals.openConfirmModal({
      title: "Supprimer l'annonce",
      centered: true,
      children: (
        <Text size="sm">
          Tu es sûr de vouloir supprimer <strong>{announcement.title}</strong> ?
        </Text>
      ),
      labels: { confirm: "Supprimer", cancel: "Annuler" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteAnnouncement(announcement.id_Announcement);

          notifySuccess({
            title: "Annonce supprimée",
            message: "L'annonce a bien été supprimée.",
          });

          await loadData(false);
        } catch (error) {
          const message = getReadableErrorMessage(
            error,
            "Impossible de supprimer l'annonce."
          );

          notifyError({
            title: "Suppression impossible",
            message,
          });
        }
      },
    });
  };

  return (
    <Stack gap="lg">
      <Paper withBorder radius="lg" p="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <Group align="flex-start" gap="md">
              <ThemeIcon size={48} radius="md" variant="light">
                <IconSpeakerphone size={24} />
              </ThemeIcon>

              <div>
                <Title order={2}>Gestion des annonces</Title>
                <Text c="dimmed" mt={4}>
                  Consulte, crée, modifie et supprime les annonces visibles côté plateforme.
                </Text>
              </div>
            </Group>

            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleOpenCreate}
              radius="md"
            >
              Nouvelle annonce
            </Button>
          </Group>

          <Divider />

          <TextInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Rechercher par titre, slug ou type..."
            leftSection={<IconSearch size={16} />}
            radius="md"
          />
        </Stack>
      </Paper>

      {loading ? (
        <Paper withBorder radius="lg" p="xl">
          <Center py="md">
            <Loader />
          </Center>
        </Paper>
      ) : filteredAnnouncements.length === 0 ? (
        <Paper withBorder radius="lg" p="xl">
          <Stack gap="xs" align="center">
            <ThemeIcon size={42} radius="xl" variant="light" color="gray">
              <IconSpeakerphone size={20} />
            </ThemeIcon>
            <Text fw={600}>Aucune annonce trouvée</Text>
            <Text c="dimmed" size="sm">
              Crée une première annonce ou ajuste la recherche.
            </Text>
          </Stack>
        </Paper>
      ) : (
        <AnnouncementList
          announcements={filteredAnnouncements}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <AnnouncementFormModal
        opened={opened}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        types={announcementTypes}
        editingAnnouncement={editingAnnouncement}
        loading={saving}
      />
    </Stack>
  );
}