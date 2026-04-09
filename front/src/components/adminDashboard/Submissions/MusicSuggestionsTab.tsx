import { useEffect, useMemo, useState } from "react";
import { Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { API_URL } from "../../../config";
import { notifyError, notifySuccess } from "../../../utils/notify";
import SuggestionsList from "./SuggestionsList";
import AcceptSuggestionForm from "./AcceptSuggestionForm";
import ManualSongForm from "./ManualSongForm";
import type { AddedSong, SongSuggestion, SuggestionStatus } from "./types";

type ApiAdminSuggestion = {
  idSuggestion?: number;
  id_suggestion?: number;
  id_Suggestion?: number;
  Id_Suggestion?: number;
  title?: string;
  Title?: string;
  albumName?: string;
  album_name?: string;
  album_Name?: string;
  Album_Name?: string;
  artistName?: string;
  artist_name?: string;
  artist_Name?: string;
  Artist_Name?: string;
  message?: string | null;
  Message?: string | null;
  status?: string;
  Status?: string;
  proposedBy?: string;
  proposed_by?: string;
  ProposedBy?: string;
  createdAt?: string;
  created_at?: string;
  Created_At?: string;
};

function getStoredAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

function normalizeStatus(value?: string): SuggestionStatus {
  if (value === "accepted") return "accepted";
  if (value === "rejected") return "rejected";
  return "pending";
}

function formatDateToApi(date: string): string {
  return date;
}

function mapApiSuggestion(item: ApiAdminSuggestion, index: number): SongSuggestion {
  const parsedId =
    item.idSuggestion ??
    item.id_suggestion ??
    item.id_Suggestion ??
    item.Id_Suggestion ??
    -(index + 1);

  return {
    id: parsedId > 0 ? parsedId : -(index + 1),
    title: item.title ?? item.Title ?? "",
    album:
      item.albumName ??
      item.album_name ??
      item.album_Name ??
      item.Album_Name ??
      "",
    artist:
      item.artistName ??
      item.artist_name ??
      item.artist_Name ??
      item.Artist_Name ??
      "",
    message: item.message ?? item.Message ?? "",
    proposedBy:
      item.proposedBy ??
      item.proposed_by ??
      item.ProposedBy ??
      "Utilisateur inconnu",
    status: normalizeStatus(item.status ?? item.Status),
    createdAt: item.createdAt ?? item.created_at ?? item.Created_At ?? "",
  };
}

export default function MusicSuggestionsTab() {
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [addedSongs, setAddedSongs] = useState<AddedSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchAdminSuggestions = async () => {
    const token = getStoredAccessToken();

    if (!token) {
      notifyError({
        title: "Erreur",
        message: "Aucun token trouvé. Connecte-toi avec un compte admin.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/music-suggestions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Impossible de récupérer les suggestions.");
      }

      const data = await response.json();
      console.log("admin suggestions API:", data);

      if (!Array.isArray(data)) {
        setSuggestions([]);
        return;
      }

      console.log(
        "mapped admin suggestions:",
        data.map((item, index) => mapApiSuggestion(item, index))
      );
      setSuggestions(data.map((item, index) => mapApiSuggestion(item, index)));
    } catch (error) {
      console.error("Erreur chargement admin suggestions :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du chargement des suggestions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSuggestions();
  }, []);

  const handleRejectSuggestion = async (id: number) => {
    const token = getStoredAccessToken();

    if (!token) {
      notifyError({
        title: "Erreur",
        message: "Aucun token trouvé.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/music-suggestions/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminComment: "",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Impossible de refuser la suggestion.");
      }

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

      notifySuccess({
        title: "Suggestion refusée",
        message: "La proposition a bien été refusée.",
      });
    } catch (error) {
      console.error("Erreur refus suggestion :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du refus.",
      });
    }
  };

  const handleAcceptSuggestion = async () => {
    if (!selectedSuggestion || !releaseDate || !album.trim()) return;

    const token = getStoredAccessToken();

    if (!token) {
      notifyError({
        title: "Erreur",
        message: "Aucun token trouvé.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/music-suggestions/${selectedSuggestion.id}/accept`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            albumName: album.trim(),
            releaseDate: formatDateToApi(releaseDate),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Impossible d'accepter la suggestion.");
      }

      const result = await response.json().catch(() => null);

      const newSong: AddedSong = {
        id: result?.createdTrackId ?? Date.now(),
        title: selectedSuggestion.title,
        artist: selectedSuggestion.artist,
        album: album.trim(),
        releaseDate: formatDateToApi(releaseDate),
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

      notifySuccess({
        title: "Suggestion acceptée",
        message: "La musique a bien été ajoutée via la suggestion.",
      });
    } catch (error) {
      console.error("Erreur accept suggestion :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'acceptation.",
      });
    }
  };

  const handleAddManualSong = async () => {
    if (!manualReleaseDate) return;

    const newSong: AddedSong = {
      id: Date.now(),
      title: manualTitle.trim(),
      artist: manualArtist.trim(),
      album: manualAlbum.trim(),
      releaseDate: formatDateToApi(manualReleaseDate),
    };

    setAddedSongs((prev) => [newSong, ...prev]);

    setManualTitle("");
    setManualArtist("");
    setManualAlbum("");
    setManualReleaseDate(null);

    notifySuccess({
      title: "Ajout manuel",
      message: "La musique a été ajoutée dans le tableau local.",
    });
  };

  return (
    <Stack gap="lg">
      <Paper withBorder radius="md" p="lg">
        <Title order={2}>Gestion des musiques</Title>
        <Text c="dimmed" mt="xs">
          Consulte les propositions des joueurs, accepte ou refuse une musique,
          puis ajoute les informations nécessaires à la base.
        </Text>
        <Text c="dimmed" size="sm" mt="xs">
          {isLoading ? "Chargement des suggestions..." : `${suggestions.length} suggestion(s) chargée(s)`}
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

    </Stack>
  );
}