import { Badge, Group, Paper, ScrollArea, Table, Text, Title } from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import type { AddedSong } from "./types";

type AddedSongsTableProps = {
  addedSongs: AddedSong[];
};

export default function AddedSongsTable({ addedSongs }: AddedSongsTableProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={3}>Musiques ajoutées</Title>
          <Text c="dimmed" size="sm">
            Liste des musiques validées et ajoutées.
          </Text>
        </div>

        <Badge leftSection={<IconMusic size={14} />} variant="light">
          {addedSongs.length} musiques
        </Badge>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Titre</Table.Th>
              <Table.Th>Artiste</Table.Th>
              <Table.Th>Album</Table.Th>
              <Table.Th>Date de sortie</Table.Th>
              <Table.Th>Origine</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {addedSongs.map((song) => (
              <Table.Tr key={song.id}>
                <Table.Td>{song.title}</Table.Td>
                <Table.Td>{song.artist}</Table.Td>
                <Table.Td>{song.album}</Table.Td>
                <Table.Td>{song.releaseDate}</Table.Td>
                <Table.Td>
                  {song.addedFromSuggestionId ? "Proposition joueur" : "Ajout manuel"}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}