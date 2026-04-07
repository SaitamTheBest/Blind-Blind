import React from "react";
import {
  Alert,
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
import { IconInfoCircle } from "@tabler/icons-react";
import classes from "../../../styles/account/AuthenticationTitle.module.css";
import { getSuggestionBadge } from "./helpers";
import { SongSuggestion, SuggestionFormData } from "./types";

type ProfileSuggestionsTabProps = {
  onSubmitSongSuggestion?: (data: SuggestionFormData) => void;
  songSuggestions: SongSuggestion[];
};

const MAX_PENDING_SUGGESTIONS = 5;

export default function ProfileSuggestionsTab({
  onSubmitSongSuggestion,
  songSuggestions,
}: ProfileSuggestionsTabProps) {
  const [suggestionTitle, setSuggestionTitle] = React.useState("");
  const [suggestionAlbum, setSuggestionAlbum] = React.useState("");
  const [suggestionArtist, setSuggestionArtist] = React.useState("");
  const [suggestionMessage, setSuggestionMessage] = React.useState("");

  const pendingSuggestionsCount = songSuggestions.filter(
    (suggestion) => suggestion.status === "pending"
  ).length;

  const remainingSuggestions = Math.max(
    0,
    MAX_PENDING_SUGGESTIONS - pendingSuggestionsCount
  );

  const isLimitReached = remainingSuggestions <= 0;

  const canSubmit =
    !isLimitReached &&
    suggestionTitle.trim().length > 0 &&
    suggestionAlbum.trim().length > 0 &&
    suggestionArtist.trim().length > 0;

  const handleSubmitSuggestion = () => {
    if (!canSubmit) return;

    onSubmitSongSuggestion?.({
      title: suggestionTitle.trim(),
      album: suggestionAlbum.trim(),
      artist: suggestionArtist.trim(),
      message: suggestionMessage.trim(),
    });

    setSuggestionTitle("");
    setSuggestionAlbum("");
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

      <Alert
        icon={<IconInfoCircle size={16} />}
        radius="md"
        variant="light"
        color={isLimitReached ? "red" : "blue"}
      >
        <Group justify="space-between" align="center">
          <div>
            <Text fw={600}>
              {isLimitReached
                ? "Limite atteinte"
                : `Il te reste ${remainingSuggestions} proposition(s) en attente possible(s) cette semaine.`}
            </Text>
            <Text size="sm" c="dimmed">
              Maximum : {MAX_PENDING_SUGGESTIONS} suggestions en attente sur 7 jours.
            </Text>
          </div>

          <Badge variant="light" color={isLimitReached ? "red" : "blue"}>
            {pendingSuggestionsCount}/{MAX_PENDING_SUGGESTIONS} en attente
          </Badge>
        </Group>
      </Alert>

      <Paper withBorder radius="lg" p="lg" className={classes.innerCard}>
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <TextInput
              label="Titre de la musique"
              placeholder="Ex. Someone Like You"
              value={suggestionTitle}
              onChange={(event) => setSuggestionTitle(event.currentTarget.value)}
              radius="md"
              disabled={isLimitReached}
            />

            <TextInput
              label="Album"
              placeholder="Ex. 21"
              value={suggestionAlbum}
              onChange={(event) => setSuggestionAlbum(event.currentTarget.value)}
              radius="md"
              disabled={isLimitReached}
            />

            <TextInput
              label="Artiste"
              placeholder="Ex. Adele"
              value={suggestionArtist}
              onChange={(event) => setSuggestionArtist(event.currentTarget.value)}
              radius="md"
              disabled={isLimitReached}
            />
          </SimpleGrid>

          <Textarea
            label="Pourquoi cette proposition ?"
            placeholder="Petit message optionnel..."
            minRows={3}
            value={suggestionMessage}
            onChange={(event) => setSuggestionMessage(event.currentTarget.value)}
            radius="md"
            disabled={isLimitReached}
          />

          <Group justify="flex-end">
            <Button radius="xl" onClick={handleSubmitSuggestion} disabled={!canSubmit}>
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

                        {suggestion.album && (
                          <Text size="sm" c="dimmed">
                            Album : {suggestion.album}
                          </Text>
                        )}

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