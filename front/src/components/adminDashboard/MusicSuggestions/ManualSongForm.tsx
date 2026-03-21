import { Button, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconPlus } from "@tabler/icons-react";

type ManualSongFormProps = {
  manualTitle: string;
  setManualTitle: (value: string) => void;
  manualArtist: string;
  setManualArtist: (value: string) => void;
  manualAlbum: string;
  setManualAlbum: (value: string) => void;
  manualReleaseDate: string | null;
  setManualReleaseDate: (value: string | null) => void;
  canAddManualSong: boolean;
  onAddManualSong: () => void;
};

export default function ManualSongForm({
  manualTitle,
  setManualTitle,
  manualArtist,
  setManualArtist,
  manualAlbum,
  setManualAlbum,
  manualReleaseDate,
  setManualReleaseDate,
  canAddManualSong,
  onAddManualSong,
}: ManualSongFormProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3}>Ajouter une musique manuellement</Title>
      <Text c="dimmed" size="sm" mt="xs" mb="md">
        Pour ajouter directement une musique sans passer par une proposition.
      </Text>

      <Stack>
        <TextInput
          label="Titre"
          placeholder="Ex. In The End"
          value={manualTitle}
          onChange={(event) => setManualTitle(event.currentTarget.value)}
        />

        <TextInput
          label="Artiste"
          placeholder="Ex. Linkin Park"
          value={manualArtist}
          onChange={(event) => setManualArtist(event.currentTarget.value)}
        />

        <TextInput
          label="Album"
          placeholder="Ex. Hybrid Theory"
          value={manualAlbum}
          onChange={(event) => setManualAlbum(event.currentTarget.value)}
        />

        <DateInput
          label="Date de sortie"
          placeholder="Sélectionner une date"
          value={manualReleaseDate}
          onChange={setManualReleaseDate}
        />

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={onAddManualSong}
          disabled={!canAddManualSong}
        >
          Ajouter la musique
        </Button>
      </Stack>
    </Paper>
  );
}