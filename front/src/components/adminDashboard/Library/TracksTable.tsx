import { useMemo, useState } from "react";
import {
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { Track } from "./types";

interface TracksTableProps {
  data: Track[];
}

export default function TracksTable({ data }: TracksTableProps) {
  const [search, setSearch] = useState("");

  const filteredTracks = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return data;

    return data.filter((track) => {
      const values = [
        track.id_Track,
        track.name,
        track.release_Year,
        track.nb_Stream,
        track.feat ? "oui" : "non",
        track.time,
        track.url_Source,
        track.genre?.libelle,
        track.genre?.id_Genre,
        track.album?.id_Album,
        track.album?.artist?.name,
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  return (
    <>
      <Group mb="md" justify="space-between">
        <Text fw={600}>Liste des musiques</Text>
        <TextInput
          placeholder="Rechercher une musique..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          w={320}
        />
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders miw={1400}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID Track</Table.Th>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Année</Table.Th>
              <Table.Th>Streams</Table.Th>
              <Table.Th>Feat</Table.Th>
              <Table.Th>Durée</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>Genre</Table.Th>
              <Table.Th>ID Album</Table.Th>
              <Table.Th>Artiste</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredTracks.length > 0 ? (
              filteredTracks.map((track) => (
                <Table.Tr key={track.id_Track}>
                  <Table.Td>{track.id_Track}</Table.Td>
                  <Table.Td>{track.name || "-"}</Table.Td>
                  <Table.Td>{track.release_Year ?? "-"}</Table.Td>
                  <Table.Td>{track.nb_Stream ?? "-"}</Table.Td>
                  <Table.Td>{track.feat ? "Oui" : "Non"}</Table.Td>
                  <Table.Td>{track.time || "-"}</Table.Td>
                  <Table.Td>{track.url_Source || "-"}</Table.Td>
                  <Table.Td>{track.genre?.libelle || "-"}</Table.Td>
                  <Table.Td>{track.album?.id_Album || "-"}</Table.Td>
                  <Table.Td>{track.album?.artist?.name || "-"}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={10}>
                  <Text c="dimmed" ta="center">
                    Aucune musique trouvée.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}