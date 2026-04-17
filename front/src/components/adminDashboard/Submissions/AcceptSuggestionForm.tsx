import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import type { SongSuggestion } from "./types";

type AcceptSuggestionFormProps = {
  pendingSuggestions: SongSuggestion[];
  selectedSuggestionId: string | null;
  onOpenProcessing: () => void;
};

export default function AcceptSuggestionForm({
  pendingSuggestions,
  selectedSuggestionId,
  onOpenProcessing,
}: AcceptSuggestionFormProps) {
  const selectedSuggestion =
    pendingSuggestions.find(
      (suggestion) => String(suggestion.id) === selectedSuggestionId
    ) ?? null;

  return (
    <Paper
      withBorder
      radius="md"
      p="lg"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 420,
      }}
    >
      <Stack gap="md" style={{ flex: 1 }}>
        <div>
          <Title order={3}>Traiter une proposition</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Sélectionne une proposition dans la liste, puis ouvre le formulaire
            complet pour lier ou créer l’artiste, l’album, les featurings, les
            paroles et la track.
          </Text>
        </div>

        {selectedSuggestion ? (
          <Paper withBorder radius="md" p="md">
            <Stack gap={4}>
              <Text fw={600}>{selectedSuggestion.title}</Text>

              {selectedSuggestion.album && (
                <Text size="sm" c="dimmed">
                  Album : {selectedSuggestion.album}
                </Text>
              )}

              <Text size="sm" c="dimmed">
                Artiste : {selectedSuggestion.artist}
              </Text>

              <Text size="xs" c="dimmed">
                Proposé par {selectedSuggestion.proposedBy}
                {selectedSuggestion.createdAt
                  ? ` • ${selectedSuggestion.createdAt}`
                  : ""}
              </Text>

              {selectedSuggestion.message && (
                <Text size="sm" mt="xs">
                  “{selectedSuggestion.message}”
                </Text>
              )}
            </Stack>
          </Paper>
        ) : (
          <Paper
            withBorder
            radius="md"
            p="md"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="sm" c="dimmed" ta="center">
              Sélectionne une suggestion dans la liste de gauche pour commencer
              le traitement.
            </Text>
          </Paper>
        )}

        <Button
          mt="auto"
          leftSection={<IconCheck size={16} />}
          onClick={onOpenProcessing}
          disabled={!selectedSuggestion}
        >
          Ouvrir le formulaire complet
        </Button>
      </Stack>
    </Paper>
  );
}