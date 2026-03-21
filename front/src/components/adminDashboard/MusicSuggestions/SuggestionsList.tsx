import { ActionIcon, Badge, Divider, Group, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { getStatusBadge } from "./helpers";
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
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={3}>Propositions des joueurs</Title>
          <Text c="dimmed" size="sm">
            Les joueurs proposent : titre, artiste, message optionnel.
          </Text>
        </div>

        <Badge variant="light" color="blue">
          {pendingCount} en attente
        </Badge>
      </Group>

      <ScrollArea h={420}>
        <Stack gap="sm">
          {suggestions.length === 0 && (
            <Paper withBorder radius="md" p="md">
              <Text c="dimmed">Aucune proposition pour le moment.</Text>
            </Paper>
          )}

          {suggestions.map((suggestion, index) => (
            <div key={suggestion.id}>
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={700}>{suggestion.title}</Text>
                  <Text size="sm" c="dimmed">
                    {suggestion.artist}
                  </Text>
                  <Text size="xs" mt={4} c="dimmed">
                    Proposé par {suggestion.proposedBy} • {suggestion.createdAt}
                  </Text>

                  {suggestion.message && (
                    <Text size="sm" mt="xs">
                      “{suggestion.message}”
                    </Text>
                  )}
                </div>

                <Group gap="xs">
                  {getStatusBadge(suggestion.status)}

                  {suggestion.status === "pending" && (
                    <>
                      <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => onSelectSuggestion(String(suggestion.id))}
                      >
                        <IconCheck size={16} />
                      </ActionIcon>

                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => onRejectSuggestion(suggestion.id)}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </>
                  )}
                </Group>
              </Group>

              {index < suggestions.length - 1 && <Divider mt="md" />}
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}