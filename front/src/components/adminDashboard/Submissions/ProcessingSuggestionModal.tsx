import {
  Avatar,
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Image,
  Paper,
  Radio,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import type {
  AlbumOption,
  ArtistOption,
  FeaturingArtist,
  GenreOption,
  SongSuggestion,
  SuggestionProcessingForm,
  TypeArtistOption,
} from "./types";
import {
  createEmptyFeaturingArtist,
  createEmptyNewArtistForm,
} from "./types";
import { validateSuggestionProcessingForm } from "./validation";

type ProcessingSuggestionModalProps = {
  suggestion: SongSuggestion;
  form: SuggestionProcessingForm;
  setForm: React.Dispatch<React.SetStateAction<SuggestionProcessingForm>>;
  artistsOptions: ArtistOption[];
  albumsOptions: AlbumOption[];
  genresOptions: GenreOption[];
  typeArtistOptions: TypeArtistOption[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

function toDateValue(value: string | null): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(value: Date | string | null): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getArtistImageSrc(imageValue?: string | null): string | undefined {
  if (!imageValue) {
    return undefined;
  }

  const trimmedValue = imageValue.trim();

  if (!trimmedValue) {
    return undefined;
  }

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("data:image/")
  ) {
    return trimmedValue;
  }

  return `data:image/jpeg;base64,${trimmedValue}`;
}

function renderArtistOption({ option }: { option: any }) {
  const imageSrc = getArtistImageSrc(option.imageArtists);

  return (
    <Group gap="sm" wrap="nowrap">
      <Avatar src={imageSrc} radius="xl" size={32}>
        {option.label?.[0]?.toUpperCase() ?? "?"}
      </Avatar>

      <Text size="sm" fw={500}>
        {option.label}
      </Text>
    </Group>
  );
}

type ImageDropzoneFieldProps = {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
};

function ImageDropzoneField({
  label,
  value,
  onChange,
}: ImageDropzoneFieldProps) {
  const previewUrl = value ? URL.createObjectURL(value) : null;

  return (
    <Box>
      <Text fw={500} size="sm" mb={6}>
        {label}
      </Text>

      <Dropzone
        onDrop={(files) => onChange(files[0] ?? null)}
        onReject={() => {}}
        maxSize={8 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        styles={{
          root: {
            minHeight: 150,
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
          gap="md"
          style={{ pointerEvents: "none", textAlign: "center" }}
        >
          <Dropzone.Accept>
            <IconUpload size={36} stroke={1.5} />
          </Dropzone.Accept>

          <Dropzone.Reject>
            <IconX size={36} stroke={1.5} />
          </Dropzone.Reject>

          <Dropzone.Idle>
            <IconPhoto size={36} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text fw={600}>
              Glisse une image ici ou clique pour sélectionner un fichier
            </Text>
            <Text size="sm" c="dimmed">
              PNG, JPG, WEBP jusqu'à 8 Mo
            </Text>
          </div>
        </Group>
      </Dropzone>

      {value && (
        <Group mt="xs" justify="space-between">
          <Text size="sm" c="dimmed">
            Fichier sélectionné : <strong>{value.name}</strong>
          </Text>

          <Button
            size="xs"
            variant="light"
            color="red"
            onClick={() => onChange(null)}
          >
            Retirer
          </Button>
        </Group>
      )}

      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Preview"
          radius="md"
          mt="md"
          mah={180}
          fit="contain"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
          }}
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      )}
    </Box>
  );
}

function ProcessingArtistFields({
  title,
  mode,
  onModeChange,
  existingArtistId,
  onExistingArtistChange,
  newArtist,
  onNewArtistChange,
  artistsOptions,
  typeArtistOptions,
}: {
  title: string;
  mode: "existing" | "new";
  onModeChange: (value: "existing" | "new") => void;
  existingArtistId: string | null;
  onExistingArtistChange: (value: string | null) => void;
  newArtist: SuggestionProcessingForm["newArtist"];
  onNewArtistChange: <K extends keyof SuggestionProcessingForm["newArtist"]>(
    field: K,
    value: SuggestionProcessingForm["newArtist"][K]
  ) => void;
  artistsOptions: ArtistOption[];
  typeArtistOptions: TypeArtistOption[];
}) {
  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>{title}</Title>

        <Radio.Group
          label="Mode"
          value={mode}
          onChange={(value) => onModeChange(value as "existing" | "new")}
        >
          <Group mt="xs">
            <Radio value="existing" label="Lier un artiste existant" />
            <Radio value="new" label="Créer un nouvel artiste" />
          </Group>
        </Radio.Group>

        {mode === "existing" ? (
          <Select
            label="Artiste existant"
            placeholder="Sélectionner un artiste"
            searchable
            data={artistsOptions}
            value={existingArtistId}
            onChange={onExistingArtistChange}
            nothingFoundMessage="Aucun artiste trouvé"
            renderOption={renderArtistOption}
          />
        ) : (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Nom de l'artiste"
                placeholder="Ex. Adele"
                value={newArtist.name}
                onChange={(event) =>
                  onNewArtistChange("name", event.currentTarget.value)
                }
              />

              <Select
                label="Type d'artiste"
                placeholder="Sélectionner un type"
                searchable
                data={typeArtistOptions}
                value={newArtist.typeArtistId}
                onChange={(value) => onNewArtistChange("typeArtistId", value)}
                nothingFoundMessage="Aucun type trouvé"
              />

              <TextInput
                label="Date de début"
                type="date"
                value={newArtist.startDate ?? ""}
                onChange={(event) =>
                  onNewArtistChange("startDate", event.currentTarget.value || null)
                }
              />

              <TextInput
                label="Dernière sortie"
                type="date"
                value={newArtist.lastRelease ?? ""}
                onChange={(event) =>
                  onNewArtistChange("lastRelease", event.currentTarget.value || null)
                }
              />

              <TextInput
                label="Nationalité"
                placeholder="Ex. UK"
                value={newArtist.nationality}
                onChange={(event) =>
                  onNewArtistChange("nationality", event.currentTarget.value)
                }
              />

              <TextInput
                label="Nombre de followers"
                placeholder="Ex. 1500000"
                value={newArtist.nbFollowers}
                onChange={(event) =>
                  onNewArtistChange("nbFollowers", event.currentTarget.value)
                }
              />
            </SimpleGrid>

            <ImageDropzoneField
              label="Image artiste"
              value={newArtist.imageArtists}
              onChange={(file) => onNewArtistChange("imageArtists", file)}
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

function FeaturingCard({
  featuring,
  index,
  artistsOptions,
  typeArtistOptions,
  onModeChange,
  onExistingArtistChange,
  onNewArtistChange,
  onRemove,
}: {
  featuring: FeaturingArtist;
  index: number;
  artistsOptions: ArtistOption[];
  typeArtistOptions: TypeArtistOption[];
  onModeChange: (mode: "existing" | "new") => void;
  onExistingArtistChange: (value: string | null) => void;
  onNewArtistChange: <K extends keyof FeaturingArtist["newArtist"]>(
    field: K,
    value: FeaturingArtist["newArtist"][K]
  ) => void;
  onRemove: () => void;
}) {
  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={5}>Featuring #{index + 1}</Title>

          <ActionIcon
            color="red"
            variant="light"
            onClick={onRemove}
            aria-label={`Supprimer le featuring ${index + 1}`}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>

        <Radio.Group
          label="Mode"
          value={featuring.mode}
          onChange={(value) => onModeChange(value as "existing" | "new")}
        >
          <Group mt="xs">
            <Radio value="existing" label="Artiste existant" />
            <Radio value="new" label="Nouvel artiste" />
          </Group>
        </Radio.Group>

        {featuring.mode === "existing" ? (
          <Select
            label="Artiste existant"
            placeholder="Sélectionner un artiste"
            searchable
            data={artistsOptions}
            value={featuring.existingArtistId}
            onChange={onExistingArtistChange}
            nothingFoundMessage="Aucun artiste trouvé"
            renderOption={renderArtistOption}
          />
        ) : (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Nom de l'artiste"
                value={featuring.newArtist.name}
                onChange={(event) =>
                  onNewArtistChange("name", event.currentTarget.value)
                }
              />

              <Select
                label="Type d'artiste"
                placeholder="Sélectionner un type"
                searchable
                data={typeArtistOptions}
                value={featuring.newArtist.typeArtistId}
                onChange={(value) => onNewArtistChange("typeArtistId", value)}
                nothingFoundMessage="Aucun type trouvé"
              />

              <TextInput
                label="Date de début"
                type="date"
                value={featuring.newArtist.startDate ?? ""}
                onChange={(event) =>
                  onNewArtistChange("startDate", event.currentTarget.value || null)
                }
              />

              <TextInput
                label="Dernière sortie"
                type="date"
                value={featuring.newArtist.lastRelease ?? ""}
                onChange={(event) =>
                  onNewArtistChange("lastRelease", event.currentTarget.value || null)
                }
              />

              <TextInput
                label="Nationalité"
                value={featuring.newArtist.nationality}
                onChange={(event) =>
                  onNewArtistChange("nationality", event.currentTarget.value)
                }
              />

              <TextInput
                label="Nombre de followers"
                value={featuring.newArtist.nbFollowers}
                onChange={(event) =>
                  onNewArtistChange("nbFollowers", event.currentTarget.value)
                }
              />
            </SimpleGrid>

            <ImageDropzoneField
              label="Image artiste"
              value={featuring.newArtist.imageArtists}
              onChange={(file) => onNewArtistChange("imageArtists", file)}
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default function ProcessingSuggestionModal({
  suggestion,
  form,
  setForm,
  artistsOptions,
  albumsOptions,
  genresOptions,
  typeArtistOptions,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProcessingSuggestionModalProps) {
  const updateForm = <K extends keyof SuggestionProcessingForm>(
    field: K,
    value: SuggestionProcessingForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNewArtist = <K extends keyof SuggestionProcessingForm["newArtist"]>(
    field: K,
    value: SuggestionProcessingForm["newArtist"][K]
  ) => {
    setForm((prev) => ({
      ...prev,
      newArtist: {
        ...prev.newArtist,
        [field]: value,
      },
    }));
  };

  const updateNewAlbum = <K extends keyof SuggestionProcessingForm["newAlbum"]>(
    field: K,
    value: SuggestionProcessingForm["newAlbum"][K]
  ) => {
    setForm((prev) => ({
      ...prev,
      newAlbum: {
        ...prev.newAlbum,
        [field]: value,
      },
    }));
  };

  const updateFeaturing = (
    key: string,
    updater: (current: FeaturingArtist) => FeaturingArtist
  ) => {
    setForm((prev) => ({
      ...prev,
      featurings: prev.featurings.map((item) =>
        item.key === key ? updater(item) : item
      ),
    }));
  };

  const addFeaturing = () => {
    setForm((prev) => ({
      ...prev,
      hasFeaturing: true,
      featurings: [...prev.featurings, createEmptyFeaturingArtist()],
    }));
  };

  const removeFeaturing = (key: string) => {
    setForm((prev) => {
      const nextFeaturings = prev.featurings.filter((item) => item.key !== key);

      return {
        ...prev,
        hasFeaturing: nextFeaturings.length > 0,
        featurings: nextFeaturings,
      };
    });
  };

  const handleToggleFeaturing = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      hasFeaturing: checked,
      featurings: checked
        ? prev.featurings.length > 0
          ? prev.featurings
          : [createEmptyFeaturingArtist()]
        : [],
    }));
  };

  const validation = validateSuggestionProcessingForm(form);
  const canSubmit = validation.isValid && !isSubmitting;

  return (
    <Stack gap="lg">
      <Paper withBorder radius="md" p="md">
        <Stack gap="xs">
          <Title order={4}>Source</Title>
          <Text fw={600}>{suggestion.title || "Sans titre"}</Text>

          {suggestion.album && (
            <Text size="sm" c="dimmed">
              Album proposé : {suggestion.album}
            </Text>
          )}

          <Text size="sm" c="dimmed">
            Artiste proposé : {suggestion.artist || "Inconnu"}
          </Text>

          {suggestion.proposedBy && (
            <Text size="sm" c="dimmed">
              Proposé par {suggestion.proposedBy}
              {suggestion.createdAt ? ` • ${suggestion.createdAt}` : ""}
            </Text>
          )}

          {suggestion.message && (
            <>
              <Divider />
              <Text size="sm">“{suggestion.message}”</Text>
            </>
          )}
        </Stack>
      </Paper>

      <ScrollArea.Autosize mah={620} offsetScrollbars>
        <Stack gap="lg" pr="xs">
          <Paper withBorder radius="md" p="md">
            <Stack gap="md">
              <Title order={4}>Track</Title>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Nom de la track"
                  placeholder="Ex. Wake Me Up"
                  value={form.trackName}
                  onChange={(event) =>
                    updateForm("trackName", event.currentTarget.value)
                  }
                />

                <TextInput
                  label="Année de sortie"
                  placeholder="Ex. 2013"
                  value={form.releaseYear}
                  onChange={(event) =>
                    updateForm("releaseYear", event.currentTarget.value)
                  }
                />

                <TextInput
                  label="Popularité"
                  placeholder="Ex. 85"
                  value={form.popularity}
                  onChange={(event) =>
                    updateForm("popularity", event.currentTarget.value)
                  }
                />

                <TextInput
                  label="Durée"
                  placeholder="Ex. 00:03:52"
                  value={form.duration}
                  onChange={(event) =>
                    updateForm("duration", event.currentTarget.value)
                  }
                />
              </SimpleGrid>

              <TextInput
                label="URL source"
                placeholder="Ex. https://..."
                value={form.urlSource}
                onChange={(event) =>
                  updateForm("urlSource", event.currentTarget.value)
                }
              />

              <Select
                label="Genre track"
                placeholder="Sélectionner un genre"
                searchable
                data={genresOptions}
                value={form.genreId}
                onChange={(value) => updateForm("genreId", value)}
                nothingFoundMessage="Aucun genre trouvé"
              />

              <Textarea
                label="Paroles"
                placeholder="Ajouter les paroles si besoin"
                minRows={5}
                value={form.lyrics}
                onChange={(event) =>
                  updateForm("lyrics", event.currentTarget.value)
                }
              />
            </Stack>
          </Paper>

          <ProcessingArtistFields
            title="Artiste principal"
            mode={form.artistMode}
            onModeChange={(value) => updateForm("artistMode", value)}
            existingArtistId={form.existingArtistId}
            onExistingArtistChange={(value) =>
              updateForm("existingArtistId", value)
            }
            newArtist={form.newArtist}
            onNewArtistChange={updateNewArtist}
            artistsOptions={artistsOptions}
            typeArtistOptions={typeArtistOptions}
          />

          <Paper withBorder radius="md" p="md">
            <Stack gap="md">
              <Title order={4}>Album</Title>

              <Radio.Group
                label="Mode"
                value={form.albumMode}
                onChange={(value) =>
                  updateForm("albumMode", value as "existing" | "new")
                }
              >
                <Group mt="xs">
                  <Radio value="existing" label="Lier un album existant" />
                  <Radio value="new" label="Créer un nouvel album" />
                </Group>
              </Radio.Group>

              {form.albumMode === "existing" ? (
                <Select
                  label="Album existant"
                  placeholder="Sélectionner un album"
                  searchable
                  data={albumsOptions}
                  value={form.existingAlbumId}
                  onChange={(value) => updateForm("existingAlbumId", value)}
                  nothingFoundMessage="Aucun album trouvé"
                />
              ) : (
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      label="Nom de l'album"
                      placeholder="Ex. True"
                      value={form.newAlbum.name}
                      onChange={(event) =>
                        updateNewAlbum("name", event.currentTarget.value)
                      }
                    />

                    <TextInput
                      label="Année de sortie"
                      placeholder="Ex. 2013"
                      value={form.newAlbum.releaseYear}
                      onChange={(event) =>
                        updateNewAlbum("releaseYear", event.currentTarget.value)
                      }
                    />

                    <TextInput
                      label="Nombre de streams"
                      placeholder="Ex. 1500000"
                      value={form.newAlbum.nbStream}
                      onChange={(event) =>
                        updateNewAlbum("nbStream", event.currentTarget.value)
                      }
                    />
                  </SimpleGrid>

                  <ImageDropzoneField
                    label="Image album"
                    value={form.newAlbum.imageAlbum}
                    onChange={(file) => updateNewAlbum("imageAlbum", file)}
                  />

                  <Switch
                    label="Album single"
                    checked={form.newAlbum.isSingle}
                    onChange={(event) =>
                      updateNewAlbum("isSingle", event.currentTarget.checked)
                    }
                  />
                </Stack>
              )}
            </Stack>
          </Paper>

          <Paper withBorder radius="md" p="md">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Title order={4}>Featurings</Title>

                <Checkbox
                  label="La track contient des featurings"
                  checked={form.hasFeaturing}
                  onChange={(event) =>
                    handleToggleFeaturing(event.currentTarget.checked)
                  }
                />
              </Group>

              {form.hasFeaturing && (
                <>
                  <Stack gap="md">
                    {form.featurings.map((featuring, index) => (
                      <FeaturingCard
                        key={featuring.key}
                        featuring={featuring}
                        index={index}
                        artistsOptions={artistsOptions}
                        typeArtistOptions={typeArtistOptions}
                        onModeChange={(mode) =>
                          updateFeaturing(featuring.key, (current) => ({
                            ...current,
                            mode,
                            existingArtistId:
                              mode === "existing"
                                ? current.existingArtistId
                                : null,
                            newArtist:
                              mode === "new"
                                ? current.newArtist
                                : createEmptyNewArtistForm(),
                          }))
                        }
                        onExistingArtistChange={(value) =>
                          updateFeaturing(featuring.key, (current) => ({
                            ...current,
                            existingArtistId: value,
                          }))
                        }
                        onNewArtistChange={(field, value) =>
                          updateFeaturing(featuring.key, (current) => ({
                            ...current,
                            newArtist: {
                              ...current.newArtist,
                              [field]: value ?? "",
                            },
                          }))
                        }
                        onRemove={() => removeFeaturing(featuring.key)}
                      />
                    ))}
                  </Stack>

                  <Group justify="flex-end">
                    <Button
                      variant="light"
                      leftSection={<IconPlus size={16} />}
                      onClick={addFeaturing}
                    >
                      Ajouter un featuring
                    </Button>
                  </Group>
                </>
              )}
            </Stack>
          </Paper>
        </Stack>
      </ScrollArea.Autosize>

      {validation.errors.length > 0 && (
        <Paper withBorder radius="md" p="md" bg="rgba(255, 243, 191, 0.35)">
          <Stack gap={4}>
            <Text fw={600}>Champs à corriger avant validation :</Text>

            {validation.errors.map((error, index) => (
              <Text key={`${error}-${index}`} size="sm" c="dimmed">
                • {error}
              </Text>
            ))}
          </Stack>
        </Paper>
      )}

      <Group justify="flex-end">
        <Button variant="default" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>

        <Button onClick={onSubmit} loading={isSubmitting} disabled={!canSubmit}>
          Créer les données et valider
        </Button>
      </Group>
    </Stack>
  );
}