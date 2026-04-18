import { useEffect, useMemo, useState } from "react";
import { Divider, Grid, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { API_URL } from "../../../config";
import { notifyError, notifySuccess } from "../../../utils/notify";
import SuggestionsList from "./SuggestionsList";
import AcceptSuggestionForm from "./AcceptSuggestionForm";
import ManualSongForm from "./ManualSongForm";
import AddedSongsTable from "./AddedSongsTable";
import ProcessingSuggestionModal from "./ProcessingSuggestionModal";
import type {
  AddedSong,
  AlbumOption,
  ArtistOption,
  GenreOption,
  SongSuggestion,
  SuggestionProcessingForm,
  SuggestionStatus,
  TypeArtistOption,
} from "./types";

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

type ApiArtist = {
  id_artists?: string;
  Id_Artists?: string;
  name?: string;
  Name?: string;
};

type ApiAlbum = {
  id_album?: string;
  Id_Album?: string;
  name?: string;
  Name?: string;
  id_artists?: string;
  Id_Artists?: string;
  release_year?: number;
  Release_Year?: number;
};

type ApiGenre = {
  id_genre_tracks?: string;
  Id_Genre_Tracks?: string;
  id_Genre?: string | number;
  Id_Genre?: string | number;
  genre?: string;
  Genre?: string;
  libelle?: string;
  Libelle?: string;
};

type ApiTypeArtist = {
  id_type_artists?: string | number;
  Id_Type_Artists?: string | number;
  id_Type_Artists?: string | number;
  type?: string;
  Type?: string;
};

type ProcessingContext =
  | { mode: "suggestion"; suggestionId: string }
  | { mode: "manual" };

function getStoredAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

function normalizeStatus(value?: string): SuggestionStatus {
  if (value === "accepted" || value === "Accepted") return "accepted";
  if (value === "rejected" || value === "Rejected") return "rejected";
  return "pending";
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

function mapApiArtist(item: ApiArtist): ArtistOption | null {
  const value = item.id_artists ?? item.Id_Artists ?? "";
  const label = item.name ?? item.Name ?? "";
  if (!value || !label) return null;
  return { value, label };
}

function mapApiAlbum(item: ApiAlbum): AlbumOption | null {
  const value = item.id_album ?? item.Id_Album ?? "";
  const label = item.name ?? item.Name ?? "";
  if (!value || !label) return null;

  return {
    value,
    label,
    artistId: item.id_artists ?? item.Id_Artists ?? undefined,
    releaseYear: item.release_year ?? item.Release_Year ?? null,
  };
}

function mapApiGenre(item: ApiGenre): GenreOption | null {
  const rawValue =
    item.id_genre_tracks ??
    item.Id_Genre_Tracks ??
    item.id_Genre ??
    item.Id_Genre;

  const value =
    rawValue !== undefined && rawValue !== null ? String(rawValue) : "";

  const label =
    item.genre ??
    item.Genre ??
    item.libelle ??
    item.Libelle ??
    "";

  if (!value || !label) return null;

  return { value, label };
}

function mapApiTypeArtist(item: ApiTypeArtist): TypeArtistOption | null {
  const rawValue =
    item.id_type_artists ??
    item.Id_Type_Artists ??
    item.id_Type_Artists;

  const value =
    rawValue !== undefined && rawValue !== null ? String(rawValue) : "";

  const label =
    item.type ??
    item.Type ??
    "";

  if (!value || !label) return null;

  return { value, label };
}

function extractId(data: any, keys: string[]): string {
  for (const key of keys) {
    const value = data?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
}

function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export default function MusicSuggestionsTab() {
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [addedSongs, setAddedSongs] = useState<AddedSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [artistsOptions, setArtistsOptions] = useState<ArtistOption[]>([]);
  const [albumsOptions, setAlbumsOptions] = useState<AlbumOption[]>([]);
  const [genresOptions, setGenresOptions] = useState<GenreOption[]>([]);
  const [typeArtistOptions, setTypeArtistOptions] = useState<TypeArtistOption[]>([]);

  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);

  const [manualTitle, setManualTitle] = useState("");
  const [manualAlbum, setManualAlbum] = useState("");
  const [manualArtist, setManualArtist] = useState("");

  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [processingContext, setProcessingContext] = useState<ProcessingContext | null>(null);
  const [processingForm, setProcessingForm] = useState<SuggestionProcessingForm>(
    createEmptySuggestionProcessingForm()
  );
  const [isSubmittingProcess, setIsSubmittingProcess] = useState(false);

  const pendingSuggestions = useMemo(
    () => suggestions.filter((item) => item.status === "pending"),
    [suggestions]
  );

  const selectedSuggestion = useMemo(() => {
    if (!processingContext || processingContext.mode !== "suggestion") return null;

    return (
      suggestions.find(
        (item) => String(item.id) === processingContext.suggestionId
      ) ?? null
    );
  }, [processingContext, suggestions]);

  const modalSuggestion: SongSuggestion = useMemo(() => {
    if (processingContext?.mode === "suggestion" && selectedSuggestion) {
      return selectedSuggestion;
    }

    return {
      id: -999999,
      title: manualTitle.trim(),
      album: manualAlbum.trim(),
      artist: manualArtist.trim(),
      message: "",
      proposedBy: "Ajout manuel admin",
      status: "pending",
      createdAt: "",
    };
  }, [processingContext, selectedSuggestion, manualTitle, manualAlbum, manualArtist]);

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
        let userMessage = "Impossible de récupérer les suggestions.";

        try {
          const errorData = await response.json();
          if (typeof errorData?.message === "string") {
            userMessage = errorData.message;
          } else if (typeof errorData?.title === "string") {
            userMessage = errorData.title;
          }
        } catch {
          const errorText = await response.text();
          if (errorText) userMessage = errorText;
        }

        throw new Error(userMessage);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        setSuggestions([]);
        return;
      }

      setSuggestions(data.map((item, index) => mapApiSuggestion(item, index)));
    } catch (error) {
      console.error("Erreur chargement admin suggestions :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Impossible de récupérer les suggestions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtists = async () => {
    const token = getStoredAccessToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/music-data/artists`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Impossible de récupérer les artistes.");
      const data = await response.json();

      if (!Array.isArray(data)) {
        setArtistsOptions([]);
        return;
      }

      setArtistsOptions(
        data.map(mapApiArtist).filter((item): item is ArtistOption => item !== null)
      );
    } catch (error) {
      console.error("Erreur chargement artistes :", error);
    }
  };

  const fetchAlbums = async () => {
    const token = getStoredAccessToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/music-data/albums`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Impossible de récupérer les albums.");
      const data = await response.json();

      if (!Array.isArray(data)) {
        setAlbumsOptions([]);
        return;
      }

      setAlbumsOptions(
        data.map(mapApiAlbum).filter((item): item is AlbumOption => item !== null)
      );
    } catch (error) {
      console.error("Erreur chargement albums :", error);
    }
  };

  const fetchGenres = async () => {
    const token = getStoredAccessToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/music-data/genres`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Impossible de récupérer les genres.");
      const data = await response.json();

      if (!Array.isArray(data)) {
        setGenresOptions([]);
        return;
      }

      setGenresOptions(
        data.map(mapApiGenre).filter((item): item is GenreOption => item !== null)
      );
    } catch (error) {
      console.error("Erreur chargement genres :", error);
    }
  };

  const fetchTypeArtists = async () => {
    const token = getStoredAccessToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/music-data/type-artists`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer les types d’artistes.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        setTypeArtistOptions([]);
        return;
      }

      setTypeArtistOptions(
        data
          .map(mapApiTypeArtist)
          .filter((item): item is TypeArtistOption => item !== null)
      );
    } catch (error) {
      console.error("Erreur chargement type_artists :", error);
    }
  };

  useEffect(() => {
    fetchAdminSuggestions();
    fetchArtists();
    fetchAlbums();
    fetchGenres();
    fetchTypeArtists();
  }, []);

  const openProcessingModalFromSuggestion = (id: string) => {
    const suggestion = suggestions.find((item) => String(item.id) === id);

    if (!suggestion || suggestion.id <= 0) {
      notifyError({
        title: "Erreur",
        message: "Suggestion introuvable ou identifiant invalide.",
      });
      return;
    }

    setSelectedSuggestionId(id);
    setProcessingContext({ mode: "suggestion", suggestionId: id });
    setProcessingForm({
      ...createEmptySuggestionProcessingForm(),
      trackName: suggestion.title ?? "",
      newAlbum: {
        ...createEmptySuggestionProcessingForm().newAlbum,
        name: suggestion.album ?? "",
      },
      newArtist: {
        ...createEmptySuggestionProcessingForm().newArtist,
        name: suggestion.artist ?? "",
      },
    });
    setIsProcessingModalOpen(true);
  };

  const openProcessingModalFromSelected = () => {
    if (!selectedSuggestionId) {
      notifyError({
        title: "Erreur",
        message: "Sélectionne une suggestion avant de continuer.",
      });
      return;
    }

    openProcessingModalFromSuggestion(selectedSuggestionId);
  };

  const openManualProcessingModal = () => {
    if (!manualTitle.trim() || !manualAlbum.trim() || !manualArtist.trim()) {
      notifyError({
        title: "Erreur",
        message: "Renseigne le titre, l’album et l’artiste avant de continuer.",
      });
      return;
    }

    setProcessingContext({ mode: "manual" });
    setProcessingForm({
      ...createEmptySuggestionProcessingForm(),
      trackName: manualTitle.trim(),
      newAlbum: {
        ...createEmptySuggestionProcessingForm().newAlbum,
        name: manualAlbum.trim(),
      },
      newArtist: {
        ...createEmptySuggestionProcessingForm().newArtist,
        name: manualArtist.trim(),
      },
    });
    setIsProcessingModalOpen(true);
  };

  const closeProcessingModal = () => {
    setIsProcessingModalOpen(false);
    setProcessingContext(null);
    setProcessingForm(createEmptySuggestionProcessingForm());
  };

  const handleRejectSuggestion = async (id: number) => {
    if (id <= 0) {
      notifyError({
        title: "Erreur",
        message: "Identifiant de suggestion invalide. Recharge la page.",
      });
      return;
    }

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
        let userMessage = "Impossible de refuser la suggestion.";

        try {
          const errorData = await response.json();
          if (typeof errorData?.message === "string") {
            userMessage = errorData.message;
          }
        } catch {
          const errorText = await response.text();
          if (errorText) userMessage = errorText;
        }

        throw new Error(userMessage);
      }

      setSuggestions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "rejected" } : item
        )
      );

      if (
        processingContext?.mode === "suggestion" &&
        selectedSuggestion &&
        selectedSuggestion.id === id
      ) {
        closeProcessingModal();
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

  const postJson = async (url: string, body: unknown, token: string) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let message = "Une requête a échoué.";

      try {
        const errorData = await response.json();
        if (typeof errorData?.message === "string") {
          message = errorData.message;
        } else if (typeof errorData?.title === "string") {
          message = errorData.title;
        }
      } catch {
        const errorText = await response.text();
        if (errorText) message = errorText;
      }

      throw new Error(message);
    }

    return response.json().catch(() => null);
  };

  const createArtist = async (
    artist: SuggestionProcessingForm["newArtist"],
    token: string
  ) => {
    const payload = {
      Name: artist.name.trim(),
      Start_Date: artist.startDate,
      Last_Release: artist.lastRelease,
      Id_Type_Artists: artist.typeArtistId ? Number(artist.typeArtistId) : null,
      Nationality: artist.nationality.trim(),
      Nb_Followers: toNullableNumber(artist.nbFollowers),
      Image_Artists: artist.imageArtists.trim(),
    };

    const result = await postJson(`${API_URL}/api/music-data/artist`, payload, token);

    return extractId(result, [
      "id_artists",
      "Id_Artists",
      "id",
      "Id",
    ]);
  };

  const createAlbum = async (
    album: SuggestionProcessingForm["newAlbum"],
    artistId: string,
    token: string
  ) => {
    const payload = {
      Id_Artists: artistId,
      Name: album.name.trim(),
      Release_Year: toNullableNumber(album.releaseYear),
      Nb_Stream: toNullableNumber(album.nbStream),
      Image_Album: album.imageAlbum.trim(),
      Is_Single: album.isSingle,
    };

    const result = await postJson(`${API_URL}/api/music-data/album`, payload, token);

    return extractId(result, [
      "id_album",
      "Id_Album",
      "id",
      "Id",
    ]);
  };

  const createTrack = async (
    form: SuggestionProcessingForm,
    albumId: string,
    hasFeaturing: boolean,
    token: string
  ) => {
    const payload = {
      Name: form.trackName.trim(),
      Id_Album: albumId,
      Release_Year: toNullableNumber(form.releaseYear),
      Popularity: toNullableNumber(form.popularity),
      Feat: hasFeaturing,
      Time: form.duration.trim(),
      Url_Source: form.urlSource.trim(),
      Id_Genre: form.genreId ? Number(form.genreId) : null,
    };

    const result = await postJson(`${API_URL}/api/music-data/track`, payload, token);

    return extractId(result, [
      "id_tracks",
      "Id_Tracks",
      "id",
      "Id",
    ]);
  };

  const createLyrics = async (trackId: string, lyrics: string, token: string) => {
    if (!lyrics.trim()) return;

    const payload = {
      Id_Tracks: trackId,
      Lyrics: lyrics.trim(),
    };

    await postJson(`${API_URL}/api/music-data/lyrics`, payload, token);
  };

  const createFeaturing = async (
    trackId: string,
    artistId: string,
    token: string
  ) => {
    const response = await fetch(
      `${API_URL}/api/music-data/track/${trackId}/featurings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([artistId]),
      }
    );

    if (!response.ok) {
      let message = "Impossible d'ajouter le featuring.";

      try {
        const errorData = await response.json();
        if (typeof errorData?.message === "string") {
          message = errorData.message;
        } else if (typeof errorData?.title === "string") {
          message = errorData.title;
        }
      } catch {
        const errorText = await response.text();
        if (errorText) message = errorText;
      }

      throw new Error(message);
    }

    return response.json().catch(() => null);
  };

  const acceptSuggestion = async (suggestionId: number, token: string) => {
    const response = await fetch(
      `${API_URL}/api/admin/music-suggestions/${suggestionId}/accept`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      let message = "Impossible d'accepter la suggestion.";

      try {
        const errorData = await response.json();
        if (typeof errorData?.message === "string") {
          message = errorData.message;
        } else if (typeof errorData?.title === "string") {
          message = errorData.title;
        }
      } catch {
        const errorText = await response.text();
        if (errorText) message = errorText;
      }

      throw new Error(message);
    }

    return response.json().catch(() => null);
  };

  const handleProcess = async () => {
    const token = getStoredAccessToken();

    if (!token) {
      notifyError({
        title: "Erreur",
        message: "Aucun token trouvé.",
      });
      return;
    }

    setIsSubmittingProcess(true);

    try {
      notifySuccess({
        title: "Traitement en cours",
        message: "Création des données en base...",
      });

      let mainArtistId = "";
      if (processingForm.artistMode === "existing") {
        mainArtistId = processingForm.existingArtistId ?? "";
      } else {
        mainArtistId = await createArtist(processingForm.newArtist, token);
      }

      if (!mainArtistId) {
        throw new Error("Impossible de résoudre l’artiste principal.");
      }

      let albumId = "";
      if (processingForm.albumMode === "existing") {
        albumId = processingForm.existingAlbumId ?? "";
      } else {
        albumId = await createAlbum(processingForm.newAlbum, mainArtistId, token);
      }

      if (!albumId) {
        throw new Error("Impossible de résoudre l’album.");
      }

      const trackId = await createTrack(
        processingForm,
        albumId,
        processingForm.hasFeaturing,
        token
      );

      if (!trackId) {
        throw new Error("Impossible de créer la track.");
      }

      if (processingForm.hasFeaturing) {
        const featuringArtistIds: string[] = [];
            
        for (const featuring of processingForm.featurings) {
          let featuringArtistId = "";
        
          if (featuring.mode === "existing") {
            featuringArtistId = featuring.existingArtistId ?? "";
          } else {
            featuringArtistId = await createArtist(featuring.newArtist, token);
          }
        
          if (!featuringArtistId) {
            throw new Error("Impossible de résoudre un featuring.");
          }
        
          featuringArtistIds.push(featuringArtistId);
        }
      
        if (featuringArtistIds.length > 0) {
          const response = await fetch(
            `${API_URL}/api/music-data/track/${trackId}/featurings`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(featuringArtistIds),
            }
          );
        
          if (!response.ok) {
            let message = "Impossible d'ajouter les featurings.";
          
            try {
              const errorData = await response.json();
              if (typeof errorData?.message === "string") {
                message = errorData.message;
              } else if (typeof errorData?.title === "string") {
                message = errorData.title;
              }
            } catch {
              const errorText = await response.text();
              if (errorText) message = errorText;
            }
          
            throw new Error(message);
          }
        }
      }

      await createLyrics(trackId, processingForm.lyrics, token);

      if (processingContext?.mode === "suggestion" && selectedSuggestion) {
        await acceptSuggestion(selectedSuggestion.id, token);

        setSuggestions((prev) =>
          prev.map((item) =>
            item.id === selectedSuggestion.id
              ? { ...item, status: "accepted" }
              : item
          )
        );
      }

      const newSong: AddedSong = {
        id: trackId || Date.now(),
        title: processingForm.trackName.trim(),
        artist:
          processingForm.artistMode === "existing"
            ? artistsOptions.find(
                (artist) => artist.value === processingForm.existingArtistId
              )?.label ?? modalSuggestion.artist
            : processingForm.newArtist.name.trim(),
        album:
          processingForm.albumMode === "existing"
            ? albumsOptions.find(
                (album) => album.value === processingForm.existingAlbumId
              )?.label ?? modalSuggestion.album ?? ""
            : processingForm.newAlbum.name.trim(),
        releaseDate: processingForm.releaseYear.trim(),
        addedFromSuggestionId:
          processingContext?.mode === "suggestion" && selectedSuggestion
            ? selectedSuggestion.id
            : undefined,
      };

      setAddedSongs((prev) => [newSong, ...prev]);

      if (processingContext?.mode === "manual") {
        setManualTitle("");
        setManualAlbum("");
        setManualArtist("");
      }

      notifySuccess({
        title: "Succès",
        message:
          processingContext?.mode === "suggestion"
            ? "Suggestion traitée et données créées."
            : "Musique créée manuellement avec succès.",
      });

      closeProcessingModal();
      await fetchAdminSuggestions();
      await fetchArtists();
      await fetchAlbums();
    } catch (error) {
      console.error("Erreur traitement :", error);

      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du traitement.",
      });
    } finally {
      setIsSubmittingProcess(false);
    }
  };

  return (
    <Stack gap="lg">
      <Paper withBorder radius="md" p="lg">
        <Title order={2}>Gestion des musiques</Title>
        <Text c="dimmed" mt="xs">
          Consulte les propositions des joueurs, refuse-les ou traite-les avec
          toutes les données nécessaires avant l’ajout en base.
        </Text>
        <Text c="dimmed" size="sm" mt="xs">
          {isLoading
            ? "Chargement des suggestions..."
            : `${suggestions.length} suggestion(s) chargée(s)`}
        </Text>
      </Paper>

      <Grid align="stretch" gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }} style={{ display: "flex" }}>
          <SuggestionsList
            suggestions={suggestions}
            pendingCount={pendingSuggestions.length}
            onSelectSuggestion={(id) => setSelectedSuggestionId(id)}
            onRejectSuggestion={handleRejectSuggestion}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }} style={{ display: "flex" }}>
          <AcceptSuggestionForm
            pendingSuggestions={pendingSuggestions}
            selectedSuggestionId={selectedSuggestionId}
            onOpenProcessing={openProcessingModalFromSelected}
          />
        </Grid.Col>
      </Grid>

      <Divider my="xs" color="dark" size="sm" style={{ borderTopWidth: "2px" }} />

      <ManualSongForm
        manualTitle={manualTitle}
        setManualTitle={setManualTitle}
        manualAlbum={manualAlbum}
        setManualAlbum={setManualAlbum}
        manualArtist={manualArtist}
        setManualArtist={setManualArtist}
        onOpenManualProcessing={openManualProcessingModal}
      />

      <AddedSongsTable songs={addedSongs} />

      <Modal
        opened={isProcessingModalOpen}
        onClose={closeProcessingModal}
        title={
          processingContext?.mode === "manual"
            ? "Ajouter une musique manuellement"
            : "Traiter une suggestion"
        }
        size="xl"
        centered
      >
        <ProcessingSuggestionModal
          suggestion={modalSuggestion}
          form={processingForm}
          setForm={setProcessingForm}
          artistsOptions={artistsOptions}
          albumsOptions={albumsOptions}
          genresOptions={genresOptions}
          typeArtistOptions={typeArtistOptions}
          isSubmitting={isSubmittingProcess}
          onSubmit={handleProcess}
          onCancel={closeProcessingModal}
        />
      </Modal>
    </Stack>
  );
}

function createEmptySuggestionProcessingForm(): SuggestionProcessingForm {
  return {
    existingAlbumId: null,
    albumMode: "existing",
    newAlbum: {
      name: "",
      releaseYear: "",
      nbStream: "",
      imageAlbum: "",
      isSingle: false,
    },

    existingArtistId: null,
    artistMode: "existing",
    newArtist: {
      name: "",
      startDate: null,
      lastRelease: null,
      typeArtistId: null,
      nationality: "",
      nbFollowers: "",
      imageArtists: "",
    },

    trackName: "",
    releaseYear: "",
    popularity: "",
    duration: "",
    urlSource: "",
    genreId: null,
    lyrics: "",
    hasFeaturing: false,
    featurings: [],
  };
}