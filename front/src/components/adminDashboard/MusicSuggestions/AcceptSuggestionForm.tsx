import { Button, Paper, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCheck } from "@tabler/icons-react";
import type { SongSuggestion } from "./types";

type AcceptSuggestionFormProps = {
  pendingSuggestions: SongSuggestion[];
  selectedSuggestionId: string | null;
  setSelectedSuggestionId: (value: string | null) => void;
  album: string;
  setAlbum: (value: string) => void;
  releaseDate: string | null;
  setReleaseDate: (value: string | null) => void;
  canAcceptSuggestion: boolean;
  onAcceptSuggestion: () => void;
};

export default function AcceptSuggestionForm({
  pendingSuggestions,
  selectedSuggestionId,
  setSelectedSuggestionId,
  album,
  setAlbum,
  releaseDate,
  setReleaseDate,
  canAcceptSuggestion,
  onAcceptSuggestion,
}: AcceptSuggestionFormProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3}>Accepter une proposition</Title>
      <Text c="dimmed" size="sm" mt="xs" mb="md">
        Sélectionne une suggestion en attente puis complète album et date.
      </Text>

      <Stack>
        <Select
          label="Proposition"
          placeholder="Choisir une proposition"
          data={pendingSuggestions.map((item) => ({
            value: String(item.id),
            label: `${item.title} — ${item.artist}`,
          }))}
          value={selectedSuggestionId}
          onChange={setSelectedSuggestionId}
        />

        <TextInput
          label="Album"
          placeholder="Ex. Hybrid Theory"
          value={album}
          onChange={(event) => setAlbum(event.currentTarget.value)}
        />

        <DateInput
          label="Date de sortie"
          placeholder="Sélectionner une date"
          value={releaseDate}
          onChange={setReleaseDate}
        />

        <Button
          leftSection={<IconCheck size={16} />}
          onClick={onAcceptSuggestion}
          disabled={!canAcceptSuggestion}
        >
          Accepter et ajouter à la BDD
        </Button>
      </Stack>
    </Paper>
  );
}