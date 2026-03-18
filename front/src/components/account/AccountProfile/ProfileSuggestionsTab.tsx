import React from "react";
import {
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import classes from "../../../styles/account/AuthenticationTitle.module.css";
import { getSuggestionBadge } from "./helpers";
import { SongSuggestion, SuggestionFormData } from "./types";

type ProfileSuggestionsTabProps = {
  onSubmitSongSuggestion?: (data: SuggestionFormData) => void;
  songSuggestions: SongSuggestion[];
};

export default function ProfileSuggestionsTab({
  onSubmitSongSuggestion,
  songSuggestions,
}: ProfileSuggestionsTabProps) {
  const [suggestionTitle, setSuggestionTitle] = React.useState("");
  const [suggestionArtist, setSuggestionArtist] = React.useState("");
  const [suggestionMessage, setSuggestionMessage] = React.useState("");

  const handleSubmitSuggestion = () => {
    if (!suggestionTitle.trim() || !suggestionArtist.trim()) return;

    onSubmitSongSuggestion?.({
      title: suggestionTitle.trim(),
      artist: suggestionArtist.trim(),
      message: suggestionMessage.trim(),
    });

    setSuggestionTitle("");
    setSuggestionArtist("");
    setSuggestionMessage("");
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={3}>Proposer une chanson</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Envoie un titre, l’artiste, et éventuellement un petit message.
        </Text>
      </div>

      <Paper withBorder radius="lg" p="lg" className={classes.innerCard}>
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Titre de la musique"
              placeholder="Ex. Someone Like You"
              value={suggestionTitle}
              onChange={(event) => setSuggestionTitle(event.currentTarget.value)}
              radius="md"
            />

            <TextInput
              label="Artiste"
              placeholder="Ex. Adele"
              value={suggestionArtist}
              onChange={(event) => setSuggestionArtist(event.currentTarget.value)}
              radius="md"
            />
          </SimpleGrid>

          <Textarea
            label="Pourquoi cette proposition ?"
            placeholder="Petit message optionnel..."
            minRows={3}
            value={suggestionMessage}
            onChange={(event) => setSuggestionMessage(event.currentTarget.value)}
            radius="md"
          />

          <Group justify="flex-end">
            <Button radius="xl" onClick={handleSubmitSuggestion}>
              Envoyer la proposition
            </Button>
          </Group>
        </Stack>
      </Paper>

      <div>
        <Title order={4}>Liste des propositions</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Tu peux afficher ici les demandes envoyées et leur statut.
        </Text>
      </div>

      <Paper withBorder radius="lg" p="md" className={classes.propositionsList}>
        <ScrollArea h={320} offsetScrollbars>
          <Stack gap="sm">
            {songSuggestions.length === 0 ? (
              <Paper withBorder radius="md" p="lg" className={classes.emptyState}>
                <Text ta="center" c="dimmed">
                  Aucune proposition pour le moment.
                </Text>
              </Paper>
            ) : (
              songSuggestions.map((suggestion, index) => {
                const badge = getSuggestionBadge(suggestion.status);

                return (
                  <React.Fragment key={suggestion.id}>
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text fw={600}>{suggestion.title}</Text>
                        <Text size="sm" c="dimmed">
                          {suggestion.artist}
                        </Text>
                      </div>

                      <Badge
                        color={badge.color}
                        variant="light"
                        leftSection={badge.icon}
                        radius="sm"
                      >
                        {badge.label}
                      </Badge>
                    </Group>

                    {index < songSuggestions.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })
            )}
          </Stack>
        </ScrollArea>
      </Paper>
    </Stack>
  );
}