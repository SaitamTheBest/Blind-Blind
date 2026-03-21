import { useMemo, useState } from "react";
import { Grid, Paper, Stack, Text, Title } from "@mantine/core";
import SuggestionsList from "./SuggestionsList";
import AcceptSuggestionForm from "./AcceptSuggestionForm";
import ManualSongForm from "./ManualSongForm";
import AddedSongsTable from "./AddedSongsTable";
import { initialAddedSongs, initialSuggestions } from "./mockData";
import type { AddedSong, SongSuggestion } from "./types";

export default function MusicSuggestionsTab() {
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>(initialSuggestions);
  const [addedSongs, setAddedSongs] = useState<AddedSong[]>(initialAddedSongs);

  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [album, setAlbum] = useState("");
  const [releaseDate, setReleaseDate] = useState<string | null>(null);

  const [manualTitle, setManualTitle] = useState("");
  const [manualArtist, setManualArtist] = useState("");
  const [manualAlbum, setManualAlbum] = useState("");
  const [manualReleaseDate, setManualReleaseDate] = useState<string | null>(null);

  const pendingSuggestions = useMemo(
    () => suggestions.filter((item) => item.status === "pending"),
    [suggestions]
  );

  const selectedSuggestion = useMemo(
    () => suggestions.find((item) => String(item.id) === selectedSuggestionId) || null,
    [suggestions, selectedSuggestionId]
  );

  const canAcceptSuggestion =
    !!selectedSuggestion &&
    album.trim().length > 0 &&
    releaseDate !== null;

  const canAddManualSong =
    manualTitle.trim().length > 0 &&
    manualArtist.trim().length > 0 &&
    manualAlbum.trim().length > 0 &&
    manualReleaseDate !== null;

  const handleRejectSuggestion = (id: number) => {
    setSuggestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" } : item
      )
    );

    if (selectedSuggestionId === String(id)) {
      setSelectedSuggestionId(null);
      setAlbum("");
      setReleaseDate(null);
    }
  };

  const handleAcceptSuggestion = () => {
    if (!selectedSuggestion || !releaseDate || !album.trim()) return;

    const newSong: AddedSong = {
      id: Date.now(),
      title: selectedSuggestion.title,
      artist: selectedSuggestion.artist,
      album: album.trim(),
      releaseDate,
      addedFromSuggestionId: selectedSuggestion.id,
    };

    setAddedSongs((prev) => [newSong, ...prev]);
    setSuggestions((prev) =>
      prev.map((item) =>
        item.id === selectedSuggestion.id
          ? { ...item, status: "accepted" }
          : item
      )
    );

    setSelectedSuggestionId(null);
    setAlbum("");
    setReleaseDate(null);
  };

  const handleAddManualSong = () => {
    if (!manualReleaseDate) return;

    const newSong: AddedSong = {
      id: Date.now(),
      title: manualTitle.trim(),
      artist: manualArtist.trim(),
      album: manualAlbum.trim(),
      releaseDate: manualReleaseDate,
    };

    setAddedSongs((prev) => [newSong, ...prev]);

    setManualTitle("");
    setManualArtist("");
    setManualAlbum("");
    setManualReleaseDate(null);
  };

  return (
    <Stack gap="lg">
      <Paper withBorder radius="md" p="lg">
        <Title order={2}>Gestion des musiques</Title>
        <Text c="dimmed" mt="xs">
          Consulte les propositions des joueurs, accepte ou refuse une musique,
          puis ajoute les informations nécessaires à la base.
        </Text>
      </Paper>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <SuggestionsList
            suggestions={suggestions}
            pendingCount={pendingSuggestions.length}
            onSelectSuggestion={setSelectedSuggestionId}
            onRejectSuggestion={handleRejectSuggestion}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Stack gap="lg">
            <AcceptSuggestionForm
              pendingSuggestions={pendingSuggestions}
              selectedSuggestionId={selectedSuggestionId}
              setSelectedSuggestionId={setSelectedSuggestionId}
              album={album}
              setAlbum={setAlbum}
              releaseDate={releaseDate}
              setReleaseDate={setReleaseDate}
              canAcceptSuggestion={canAcceptSuggestion}
              onAcceptSuggestion={handleAcceptSuggestion}
            />

            <ManualSongForm
              manualTitle={manualTitle}
              setManualTitle={setManualTitle}
              manualArtist={manualArtist}
              setManualArtist={setManualArtist}
              manualAlbum={manualAlbum}
              setManualAlbum={setManualAlbum}
              manualReleaseDate={manualReleaseDate}
              setManualReleaseDate={setManualReleaseDate}
              canAddManualSong={canAddManualSong}
              onAddManualSong={handleAddManualSong}
            />
          </Stack>
        </Grid.Col>
      </Grid>

      <AddedSongsTable addedSongs={addedSongs} />
    </Stack>
  );
}