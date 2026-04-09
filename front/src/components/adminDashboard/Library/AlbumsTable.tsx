import { useMemo, useState } from "react";
import {
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { Album } from "./types";

interface AlbumsTableProps {
  data: Album[];
}

export default function AlbumsTable({ data }: AlbumsTableProps) {
  const [search, setSearch] = useState("");

  const filteredAlbums = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return data;

    return data.filter((album) => {
      const values = [
        album.id_Album,
        album.artist?.id_Artist,
        album.artist?.name,
        album.artist?.nationality,
        album.artist?.type_Artists?.type,
        album.tracks?.length,
        ...album.tracks.map((track) => track.name),
        ...album.tracks.map((track) => track.genre?.libelle ?? ""),
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  return (
    <>
      <Group mb="md" justify="space-between">
        <Text fw={600}>Liste des albums</Text>
        <TextInput
          placeholder="Rechercher un album..."
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
              <Table.Th>ID Album</Table.Th>
              <Table.Th>Artiste</Table.Th>
              <Table.Th>Nationalité</Table.Th>
              <Table.Th>Type artiste</Table.Th>
              <Table.Th>Followers</Table.Th>
              <Table.Th>Nb tracks</Table.Th>
              <Table.Th>Musiques</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <Table.Tr key={album.id_Album}>
                  <Table.Td>{album.id_Album}</Table.Td>
                  <Table.Td>{album.artist?.name || "-"}</Table.Td>
                  <Table.Td>{album.artist?.nationality || "-"}</Table.Td>
                  <Table.Td>{album.artist?.type_Artists?.type || "-"}</Table.Td>
                  <Table.Td>{album.artist?.nb_Followers ?? "-"}</Table.Td>
                  <Table.Td>{album.tracks?.length ?? 0}</Table.Td>
                  <Table.Td>
                    {album.tracks?.length
                      ? album.tracks.map((track) => track.name).join(", ")
                      : "-"}
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center">
                    Aucun album trouvé.
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