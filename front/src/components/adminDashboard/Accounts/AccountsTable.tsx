import {
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export type PlayerStatus = 'active' | 'inactive' | 'banned';

export type Player = {
  id: number;
  pseudo: string;
  email: string;
  status: PlayerStatus;
  createdAt: string;
  lastSessionAt: string;
};

type AccountsTableProps = {
  players: Player[];
  search: string;
  statusFilter: 'all' | PlayerStatus;
  playerToToggle: Player | null;
  totalPlayers: number;
  activePlayers: number;
  inactivePlayers: number;
  bannedPlayers: number;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: 'all' | PlayerStatus) => void;
  onOpenToggleModal: (player: Player) => void;
  onCloseToggleModal: () => void;
  onConfirmToggleBan: () => void;
};

function getStatusLabel(status: PlayerStatus) {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'inactive':
      return 'Inactif';
    case 'banned':
      return 'Banni';
    default:
      return status;
  }
}

function getStatusColor(status: PlayerStatus) {
  switch (status) {
    case 'active':
      return 'teal';
    case 'inactive':
      return 'yellow';
    case 'banned':
      return 'red';
    default:
      return 'gray';
  }
}

export default function AccountsTable({
  players,
  search,
  statusFilter,
  playerToToggle,
  totalPlayers,
  activePlayers,
  inactivePlayers,
  bannedPlayers,
  onSearchChange,
  onStatusFilterChange,
  onOpenToggleModal,
  onCloseToggleModal,
  onConfirmToggleBan,
}: AccountsTableProps) {
  const rows = players.map((player) => (
    <Table.Tr key={player.id}>
      <Table.Td style={{ color: '#000', backgroundColor: '#fff' }}>
        {player.pseudo}
      </Table.Td>

      <Table.Td style={{ color: '#000', backgroundColor: '#fff' }}>
        {player.email}
      </Table.Td>

      <Table.Td style={{ color: '#000', backgroundColor: '#fff' }}>
        {player.createdAt}
      </Table.Td>

      <Table.Td style={{ color: '#000', backgroundColor: '#fff' }}>
        {player.lastSessionAt}
      </Table.Td>

      <Table.Td style={{ color: '#000', backgroundColor: '#fff' }}>
        <Badge color={getStatusColor(player.status)} variant="light">
          {getStatusLabel(player.status)}
        </Badge>
      </Table.Td>

      <Table.Td style={{ color: '#000', backgroundColor: '#fff' }}>
        <Button
          size="xs"
          color={player.status === 'banned' ? 'blue' : 'red'}
          variant="light"
          onClick={() => onOpenToggleModal(player)}
        >
          {player.status === 'banned' ? 'Débannir' : 'Ban'}
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal
        opened={!!playerToToggle}
        onClose={onCloseToggleModal}
        title={
          playerToToggle?.status === 'banned'
            ? 'Confirmer le débannissement'
            : 'Confirmer le bannissement'
        }
        centered
      >
        <Text size="sm" c="dimmed">
          {playerToToggle?.status === 'banned'
            ? `Voulez-vous vraiment débannir ${playerToToggle?.pseudo} ?`
            : `Voulez-vous vraiment bannir ${playerToToggle?.pseudo} ?`}
        </Text>

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={onCloseToggleModal}>
            Annuler
          </Button>

          <Button
            color={playerToToggle?.status === 'banned' ? 'blue' : 'red'}
            onClick={onConfirmToggleBan}
          >
            {playerToToggle?.status === 'banned' ? 'Débannir' : 'Bannir'}
          </Button>
        </Group>
      </Modal>

      <Paper withBorder radius="md" p="md" style={{ backgroundColor: '#fff' }}>
        <Group justify="space-between" mb="md">
          <div>
            <Title order={3}>Accounts</Title>
            <Text c="dimmed" size="sm">
              Liste des joueurs et gestion des comptes
            </Text>
          </div>
        </Group>

        <Group grow mb="md">
          <TextInput
            placeholder="Rechercher par pseudo ou email"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
          />

          <Select
            data={[
              { value: 'all', label: `Tous les statuts (${totalPlayers})` },
              { value: 'active', label: `Actifs (${activePlayers})` },
              { value: 'inactive', label: `Inactifs (${inactivePlayers})` },
              { value: 'banned', label: `Bannis (${bannedPlayers})` },
            ]}
            value={statusFilter}
            onChange={(value) =>
              onStatusFilterChange(
                (value as 'all' | PlayerStatus) || 'all'
              )
            }
          />
        </Group>

        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          styles={{
            table: { backgroundColor: '#fff' },
            th: {
              color: '#000',
              backgroundColor: '#fff',
              fontWeight: 600,
            },
            td: {
              color: '#000',
              backgroundColor: '#fff',
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pseudo</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Créé le</Table.Th>
              <Table.Th>Dernière session</Table.Th>
              <Table.Th>Statut</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    color: '#000',
                    backgroundColor: '#fff',
                    padding: '20px',
                  }}
                >
                  Aucun joueur trouvé
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </>
  );
}