import { Button, Paper, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type ManualSongFormProps = {
  manualTitle: string;
  setManualTitle: (value: string) => void;
  manualAlbum: string;
  setManualAlbum: (value: string) => void;
  manualArtist: string;
  setManualArtist: (value: string) => void;
  onOpenManualProcessing: () => void;
};

export default function ManualSongForm({
  manualTitle,
  setManualTitle,
  manualAlbum,
  setManualAlbum,
  manualArtist,
  setManualArtist,
  onOpenManualProcessing,
}: ManualSongFormProps) {
  const canContinue =
    manualTitle.trim().length > 0 &&
    manualAlbum.trim().length > 0 &&
    manualArtist.trim().length > 0;

  return (
    <Paper withBorder radius="md" p="lg">
      <Stack gap="md">
        <div>
          <Title order={3}>Ajouter une musique manuellement</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Renseigne les informations de base, puis ouvre le formulaire complet
            pour créer ou lier l’artiste, l’album, les featurings, le genre et
            les autres données nécessaires.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <TextInput
            label="Titre"
            placeholder="Ex. In The End"
            value={manualTitle}
            onChange={(event) => setManualTitle(event.currentTarget.value)}
          />

          <TextInput
            label="Album"
            placeholder="Ex. Hybrid Theory"
            value={manualAlbum}
            onChange={(event) => setManualAlbum(event.currentTarget.value)}
          />

          <TextInput
            label="Artiste"
            placeholder="Ex. Linkin Park"
            value={manualArtist}
            onChange={(event) => setManualArtist(event.currentTarget.value)}
          />
        </SimpleGrid>

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={onOpenManualProcessing}
          disabled={!canContinue}
        >
          Ouvrir le formulaire complet
        </Button>
      </Stack>
    </Paper>
  );
}