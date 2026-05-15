import { useMemo, useState } from "react";
import {
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { Artist } from "./types";

interface ArtistsTableProps {
  data: Artist[];
}

export default function ArtistsTable({ data }: ArtistsTableProps) {
  const [search, setSearch] = useState("");

  const filteredArtists = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return data;

    return data.filter((artist) => {
      const values = [
        artist.id_Artist,
        artist.name,
        artist.start_Date,
        artist.last_Release,
        artist.type_Artists?.type,
        artist.nationality,
        artist.nb_Followers,
        artist.image_Artists,
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  return (
    <>
      <Group mb="md" justify="space-between">
        <Text fw={600}>Liste des artistes</Text>
        <TextInput
          placeholder="Rechercher un artiste..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          w={320}
        />
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders miw={1200}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID Artiste</Table.Th>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Date début</Table.Th>
              <Table.Th>Dernière sortie</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Nationalité</Table.Th>
              <Table.Th>Followers</Table.Th>
              <Table.Th>Image</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist, index) => (
                <Table.Tr key={artist.id_Artist ?? `${artist.name}-${index}`}>
                  <Table.Td>{artist.id_Artist}</Table.Td>
                  <Table.Td>{artist.name || "-"}</Table.Td>
                  <Table.Td>{artist.start_Date || "-"}</Table.Td>
                  <Table.Td>{artist.last_Release || "-"}</Table.Td>
                  <Table.Td>{artist.type_Artists?.type || "-"}</Table.Td>
                  <Table.Td>{artist.nationality || "-"}</Table.Td>
                  <Table.Td>{artist.nb_Followers ?? "-"}</Table.Td>
                  <Table.Td>{artist.image_Artists || "-"}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text c="dimmed" ta="center">
                    Aucun artiste trouvé.
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