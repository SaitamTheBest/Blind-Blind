import { useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Badge,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconDisc,
  IconMicrophone2,
  IconMusic,
} from "@tabler/icons-react";

import { API_URL } from "../../../config";
import AlbumsTable from "./AlbumsTable";
import ArtistsTable from "./ArtistsTable";
import TracksTable from "./TracksTable";
import type { Album, Artist, Track } from "./types";

function getStoredAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

function DataSection({
  value,
  title,
  icon,
  count,
  loading,
  error,
  children,
}: {
  value: string;
  title: string;
  icon: React.ReactNode;
  count: number;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <Accordion.Item value={value}>
      <Accordion.Control>
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm">
            {icon}
            <Text fw={600}>{title}</Text>
          </Group>

          <Badge variant="light" size="lg">
            {count}
          </Badge>
        </Group>
      </Accordion.Control>

      <Accordion.Panel>
        {loading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : error ? (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Erreur">
            {error}
          </Alert>
        ) : (
          children
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

async function fetchJson<T>(endpoint: string): Promise<T> {
  const token = getStoredAccessToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} sur ${endpoint}`);
  }

  if (!rawText.trim()) {
    throw new Error(`La route ${endpoint} a renvoyé une réponse vide.`);
  }

  if (
    rawText.trim().startsWith("<!DOCTYPE") ||
    rawText.trim().startsWith("<html")
  ) {
    throw new Error(
      `La route ${endpoint} renvoie du HTML au lieu du JSON. Vérifie API_URL ou la route backend.`
    );
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new Error(
      `Impossible de parser la réponse de ${endpoint}. Début reçu : ${rawText.slice(0, 120)}...`
    );
  }
}

export default function DiscsTab() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [loadingTracks, setLoadingTracks] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const [errorTracks, setErrorTracks] = useState<string | null>(null);
  const [errorAlbums, setErrorAlbums] = useState<string | null>(null);
  const [errorArtists, setErrorArtists] = useState<string | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setLoadingTracks(true);
        setErrorTracks(null);

        const data = await fetchJson<Track[]>("/api/games/get-all-tracks");
        setTracks(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorTracks(error instanceof Error ? error.message : "Erreur inconnue.");
      } finally {
        setLoadingTracks(false);
      }
    };

    const loadAlbums = async () => {
      try {
        setLoadingAlbums(true);
        setErrorAlbums(null);

        const data = await fetchJson<Album[]>("/api/games/get-all-albums");
        setAlbums(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorAlbums(error instanceof Error ? error.message : "Erreur inconnue.");
      } finally {
        setLoadingAlbums(false);
      }
    };

    const loadArtists = async () => {
      try {
        setLoadingArtists(true);
        setErrorArtists(null);

        const data = await fetchJson<Artist[]>("/api/games/get-all-artists");
        setArtists(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorArtists(error instanceof Error ? error.message : "Erreur inconnue.");
      } finally {
        setLoadingArtists(false);
      }
    };

    loadTracks();
    loadAlbums();
    loadArtists();
  }, []);

  return (
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" align="center" mb="md">
        <Box>
          <Title order={2}>Disque</Title>
          <Text c="dimmed" mt={4}>
            Gestion et consultation des musiques, albums et artistes présents en base.
          </Text>
        </Box>
      </Group>

      <Accordion multiple defaultValue={["tracks"]} variant="separated">
        <DataSection
          value="tracks"
          title="Musiques"
          icon={<IconMusic size={18} />}
          count={tracks.length}
          loading={loadingTracks}
          error={errorTracks}
        >
          <TracksTable data={tracks} />
        </DataSection>

        <DataSection
          value="albums"
          title="Albums"
          icon={<IconDisc size={18} />}
          count={albums.length}
          loading={loadingAlbums}
          error={errorAlbums}
        >
          <AlbumsTable data={albums} />
        </DataSection>

        <DataSection
          value="artists"
          title="Artistes"
          icon={<IconMicrophone2 size={18} />}
          count={artists.length}
          loading={loadingArtists}
          error={errorArtists}
        >
          <ArtistsTable data={artists} />
        </DataSection>
      </Accordion>
    </Paper>
  );
}