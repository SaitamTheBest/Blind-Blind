import {
  ActionIcon,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { renderStatusBadge } from "./helpers";
import type { SongSuggestion } from "./types";

type SuggestionsListProps = {
  suggestions: SongSuggestion[];
  pendingCount: number;
  onSelectSuggestion: (id: string) => void;
  onRejectSuggestion: (id: number) => void;
};

export default function SuggestionsList({
  suggestions,
  pendingCount,
  onSelectSuggestion,
  onRejectSuggestion,
}: SuggestionsListProps) {
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
      <Group justify="space-between" mb="md">
        <div>
          <Title order={3}>Propositions des joueurs</Title>
          <Text c="dimmed" size="sm">
            Les joueurs proposent : titre, album, artiste, message optionnel.
          </Text>
        </div>

        <Paper
          px="sm"
          py={4}
          radius="xl"
          withBorder={false}
          bg="rgba(0, 102, 255, 0.08)"
        >
          <Text size="xs" fw={700} c="blue">
            {pendingCount} EN ATTENTE
          </Text>
        </Paper>
      </Group>

      <ScrollArea style={{ flex: 1 }} h={340}>
        <Stack gap="sm">
          {suggestions.length === 0 && (
            <Paper withBorder radius="md" p="md">
              <Text c="dimmed">Aucune proposition pour le moment.</Text>
            </Paper>
          )}

          {suggestions.map((suggestion, index) => (
            <div key={suggestion.id}>
              <Group
                justify="space-between"
                align="flex-start"
                wrap="nowrap"
                gap="md"
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={700}>{suggestion.title}</Text>

                  {suggestion.album && (
                    <Text size="sm" c="dimmed">
                      Album : {suggestion.album}
                    </Text>
                  )}

                  <Text size="sm" c="dimmed">
                    {suggestion.artist}
                  </Text>

                  <Text size="xs" mt={4} c="dimmed">
                    Proposé par {suggestion.proposedBy}
                    {suggestion.createdAt ? ` • ${suggestion.createdAt}` : ""}
                  </Text>

                  {suggestion.message && (
                    <Text
                      size="sm"
                      mt="xs"
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      “{suggestion.message}”
                    </Text>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexShrink: 0,
                    alignItems: "flex-start",
                  }}
                >
                  {renderStatusBadge(suggestion.status)}

                  {suggestion.status === "pending" && (
                    <>
                      <Tooltip label="Préparer le traitement">
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => onSelectSuggestion(String(suggestion.id))}
                          aria-label={`Sélectionner la suggestion ${suggestion.title}`}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Refuser la suggestion">
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => onRejectSuggestion(suggestion.id)}
                          aria-label={`Refuser la suggestion ${suggestion.title}`}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </>
                  )}
                </div>
              </Group>

              {index < suggestions.length - 1 && <Divider mt="md" />}
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}