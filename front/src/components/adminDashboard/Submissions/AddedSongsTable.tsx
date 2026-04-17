import { Paper, Table, Text, Title } from "@mantine/core";
import type { AddedSong } from "./types";

type AddedSongsTableProps = {
  songs: AddedSong[];
};

export default function AddedSongsTable({ songs }: AddedSongsTableProps) {
  if (!songs.length) return null;

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3}>Musiques préparées</Title>
      <Text c="dimmed" size="sm" mt="xs" mb="md">
        Liste locale des créations réussies pendant cette session.
      </Text>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Titre</Table.Th>
            <Table.Th>Artiste</Table.Th>
            <Table.Th>Album</Table.Th>
            <Table.Th>Année</Table.Th>
            <Table.Th>Origine</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {songs.map((song) => (
            <Table.Tr key={song.id}>
              <Table.Td>{song.title}</Table.Td>
              <Table.Td>{song.artist}</Table.Td>
              <Table.Td>{song.album}</Table.Td>
              <Table.Td>{song.releaseDate || "-"}</Table.Td>
              <Table.Td>
                {song.addedFromSuggestionId ? "Suggestion" : "Ajout manuel"}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}