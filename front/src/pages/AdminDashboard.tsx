import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { NavbarMinimal, type AdminTab } from '../components/adminDashboard/NavbarMinimal';

type Player = {
  id: number;
  pseudo: string;
  email: string;
  status: 'active' | 'banned';
  createdAt: string;
};

const initialPlayers: Player[] = [
  {
    id: 1,
    pseudo: 'Enzo',
    email: 'enzo@blindblind.fr',
    status: 'active',
    createdAt: '2026-03-01',
  },
  {
    id: 2,
    pseudo: 'LuffyGear5',
    email: 'luffy@grandline.fr',
    status: 'active',
    createdAt: '2026-03-02',
  },
  {
    id: 3,
    pseudo: 'ZoroLostAgain',
    email: 'zoro@santoryu.fr',
    status: 'banned',
    createdAt: '2026-03-03',
  },
  {
    id: 4,
    pseudo: 'GojoFPS',
    email: 'gojo@jujutsu.fr',
    status: 'active',
    createdAt: '2026-03-04',
  },
];

function AccountsTab() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const totalPlayers = players.length;
  const activePlayers = useMemo(
    () => players.filter((player) => player.status === 'active').length,
    [players]
  );
  const bannedPlayers = useMemo(
    () => players.filter((player) => player.status === 'banned').length,
    [players]
  );

  const toggleBan = (id: number) => {
    setPlayers((current) =>
      current.map((player) =>
        player.id === id
          ? {
              ...player,
              status: player.status === 'banned' ? 'active' : 'banned',
            }
          : player
      )
    );
  };

  const rows = players.map((player) => (
    <Table.Tr key={player.id}>
      <Table.Td>{player.pseudo}</Table.Td>
      <Table.Td>{player.email}</Table.Td>
      <Table.Td>{player.createdAt}</Table.Td>
      <Table.Td>
        <Badge color={player.status === 'banned' ? 'red' : 'teal'} variant="light">
          {player.status === 'banned' ? 'Banni' : 'Actif'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Button
          size="xs"
          color={player.status === 'banned' ? 'blue' : 'red'}
          variant="light"
          onClick={() => toggleBan(player.id)}
        >
          {player.status === 'banned' ? 'Débannir' : 'Ban'}
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Group align="stretch" grow>
        <Card withBorder radius="md" padding="lg">
          <Text c="dimmed" size="sm">
            Nombre de joueurs
          </Text>
          <Title order={2} mt="xs">
            {totalPlayers}
          </Title>
        </Card>

        <Card withBorder radius="md" padding="lg">
          <Text c="dimmed" size="sm">
            Joueurs actifs
          </Text>
          <Title order={2} mt="xs">
            {activePlayers}
          </Title>
        </Card>

        <Card withBorder radius="md" padding="lg">
          <Text c="dimmed" size="sm">
            Joueurs bannis
          </Text>
          <Title order={2} mt="xs">
            {bannedPlayers}
          </Title>
        </Card>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={3}>Accounts</Title>
            <Text c="dimmed" size="sm">
              Liste des joueurs et gestion des bans
            </Text>
          </div>
        </Group>

        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pseudo</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Créé le</Table.Th>
              <Table.Th>Statut</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}

function DashboardTab() {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={2}>Dashboard</Title>
      <Text c="dimmed" mt="xs">
        Onglet par défaut du dashboard admin.
      </Text>
    </Paper>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={2}>{title}</Title>
      <Text c="dimmed" mt="xs">
        Onglet en attente de construction.
      </Text>
    </Paper>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavbarMinimal activeTab={activeTab} onTabChange={setActiveTab} />

      <Container fluid style={{ flex: 1, padding: '24px' }}>
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'accounts' && <AccountsTab />}
        {activeTab === 'analytics' && <PlaceholderTab title="Analytics" />}
        {activeTab === 'releases' && <PlaceholderTab title="Releases" />}
        {activeTab === 'security' && <PlaceholderTab title="Security" />}
      </Container>
    </div>
  );
}