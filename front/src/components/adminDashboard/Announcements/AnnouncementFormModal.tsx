import { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Group,
  Image,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import type {
  Announcement,
  AnnouncementType,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "./types";

interface AnnouncementFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: CreateAnnouncementPayload | UpdateAnnouncementPayload) => Promise<void>;
  types: AnnouncementType[];
  editingAnnouncement: Announcement | null;
  loading?: boolean;
}

interface FormValues {
  title: string;
  short_Description: string;
  cover_Image: File | null;
  content: string;
  publication_Date: string | null;
  id_Announcement_Type: string;
  is_Published: boolean;
  slug: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getExistingImageSrc(imageValue?: string): string {
  if (!imageValue) {
    return "";
  }

  if (imageValue.startsWith("http://") || imageValue.startsWith("https://")) {
    return imageValue;
  }

  if (imageValue.startsWith("data:image/")) {
    return imageValue;
  }

  return "";
}

export default function AnnouncementFormModal({
  opened,
  onClose,
  onSubmit,
  types,
  editingAnnouncement,
  loading = false,
}: AnnouncementFormModalProps) {
  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      short_Description: "",
      cover_Image: null,
      content: "",
      publication_Date: new Date().toISOString(),
      id_Announcement_Type: "",
      is_Published: true,
      slug: "",
    },
    validate: {
      title: (value) =>
        value.trim().length < 3 ? "Le titre doit contenir au moins 3 caractères." : null,
      short_Description: (value) =>
        value.trim().length < 5
          ? "La description courte doit contenir au moins 5 caractères."
          : null,
      content: (value) =>
        value.trim().length < 10 ? "Le contenu doit contenir au moins 10 caractères." : null,
      id_Announcement_Type: (value) => (!value ? "Sélectionne un type d'annonce." : null),
      slug: (value) => (!value.trim() ? "Le slug est obligatoire." : null),
      publication_Date: (value) => (!value ? "La date de publication est obligatoire." : null),
    },
  });

  useEffect(() => {
    if (editingAnnouncement) {
      form.setValues({
        title: editingAnnouncement.title ?? "",
        short_Description: editingAnnouncement.short_Description ?? "",
        cover_Image: null,
        content: editingAnnouncement.content ?? "",
        publication_Date: editingAnnouncement.publication_Date ?? new Date().toISOString(),
        id_Announcement_Type: String(editingAnnouncement.id_Announcement_Type ?? ""),
        is_Published: editingAnnouncement.is_Published ?? true,
        slug: editingAnnouncement.slug ?? "",
      });
      return;
    }

    form.reset();
    form.setValues({
      title: "",
      short_Description: "",
      cover_Image: null,
      content: "",
      publication_Date: new Date().toISOString(),
      id_Announcement_Type: "",
      is_Published: true,
      slug: "",
    });
  }, [editingAnnouncement, opened]);

  const previewSrc = useMemo(() => {
    if (form.values.cover_Image) {
      return URL.createObjectURL(form.values.cover_Image);
    }

    return getExistingImageSrc(editingAnnouncement?.cover_Image);
  }, [form.values.cover_Image, editingAnnouncement?.cover_Image]);

  useEffect(() => {
    return () => {
      if (previewSrc && form.values.cover_Image) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc, form.values.cover_Image]);

  const typeOptions = types.map((type) => ({
    value: String(type.id_Announcement_Type),
    label: `${type.label}${type.is_Important ? " • Important" : ""}`,
  }));

  const handleSubmit = form.onSubmit(async (values) => {
    const payload = {
      title: values.title.trim(),
      short_Description: values.short_Description.trim(),
      cover_Image: values.cover_Image,
      content: values.content.trim(),
      publication_Date: values.publication_Date ?? new Date().toISOString(),
      id_Announcement_Type: Number(values.id_Announcement_Type),
      is_Published: values.is_Published,
      slug: values.slug.trim(),
    };

    if (editingAnnouncement) {
      await onSubmit({
        id_Announcement: editingAnnouncement.id_Announcement,
        ...payload,
      });
      return;
    }

    await onSubmit(payload);
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingAnnouncement ? "Modifier une annonce" : "Créer une annonce"}
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Titre"
            placeholder="Titre de l'annonce"
            withAsterisk
            {...form.getInputProps("title")}
            onChange={(event) => {
              const value = event.currentTarget.value;
              form.setFieldValue("title", value);

              if (!editingAnnouncement) {
                form.setFieldValue("slug", slugify(value));
              }
            }}
          />

          <TextInput
            label="Slug"
            placeholder="mon-annonce"
            withAsterisk
            {...form.getInputProps("slug")}
          />

          <Textarea
            label="Description courte"
            placeholder="Résumé rapide de l'annonce"
            minRows={2}
            withAsterisk
            {...form.getInputProps("short_Description")}
          />

          <Box>
            <Text fw={500} size="sm" mb={6}>
              Image de cover
            </Text>

            <Dropzone
              onDrop={(files) => {
                const firstFile = files[0] ?? null;
                form.setFieldValue("cover_Image", firstFile);
              }}
              onReject={() => {}}
              maxSize={8 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              styles={{
                root: {
                  minHeight: 170,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  border: "2px dashed #ced4da",
                  backgroundColor: "#f8f9fa",
                  transition: "background-color 0.2s ease, border-color 0.2s ease",
                  cursor: "pointer",
                },
              }}
            >
              <Group
                justify="center"
                gap="xl"
                style={{ pointerEvents: "none", textAlign: "center" }}
              >
                <Dropzone.Accept>
                  <IconUpload size={42} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={42} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={42} stroke={1.5} />
                </Dropzone.Idle>
            
                <div>
                  <Text size="xl" inline>
                    Glisse une image ici ou clique pour sélectionner un fichier
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    PNG, JPG, WEBP
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {form.values.cover_Image && (
              <Text size="sm" mt="xs">
                Fichier sélectionné : <strong>{form.values.cover_Image.name}</strong>
              </Text>
            )}

            {!form.values.cover_Image && editingAnnouncement?.cover_Image && (
              <Text size="sm" c="dimmed" mt="xs">
                Aucune nouvelle image déposée. L’image actuelle sera conservée.
              </Text>
            )}

            {previewSrc && (
              <Image
                src={previewSrc}
                alt="Preview"
                radius="md"
                mt="md"
                mah={220}
                fit="contain"
              />
            )}
          </Box>

          <Textarea
            label="Contenu"
            placeholder="Contenu complet de l'annonce"
            minRows={6}
            withAsterisk
            {...form.getInputProps("content")}
          />

          <DateTimePicker
            label="Date de publication"
            placeholder="Choisis une date"
            withAsterisk
            value={form.values.publication_Date}
            onChange={(value) => form.setFieldValue("publication_Date", value)}
          />

          <Select
            label="Type d'annonce"
            placeholder="Choisis un type"
            data={typeOptions}
            withAsterisk
            {...form.getInputProps("id_Announcement_Type")}
          />

          <Switch
            label="Annonce publiée"
            checked={form.values.is_Published}
            onChange={(event) =>
              form.setFieldValue("is_Published", event.currentTarget.checked)
            }
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              {editingAnnouncement ? "Enregistrer" : "Créer"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}