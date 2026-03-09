import { useMemo, useState } from 'react';
import { Stack } from '@mantine/core';
import AccountsStats from './AccountsStats';
import AccountsTable, { type Player, type PlayerStatus } from './AccountsTable';

const initialPlayers: Player[] = [
  {
    id: 1,
    pseudo: 'Enzo',
    email: 'enzo@blindblind.fr',
    status: 'active',
    createdAt: '2026-03-01',
    lastSessionAt: '2026-03-08 21:14',
  },
  {
    id: 2,
    pseudo: 'LuffyGear5',
    email: 'luffy@grandline.fr',
    status: 'inactive',
    createdAt: '2026-03-02',
    lastSessionAt: '2026-03-05 18:42',
  },
  {
    id: 3,
    pseudo: 'ZoroLostAgain',
    email: 'zoro@santoryu.fr',
    status: 'banned',
    createdAt: '2026-03-03',
    lastSessionAt: '2026-03-06 09:25',
  },
  {
    id: 4,
    pseudo: 'GojoFPS',
    email: 'gojo@jujutsu.fr',
    status: 'active',
    createdAt: '2026-03-04',
    lastSessionAt: '2026-03-08 23:03',
  },
];

export default function AccountsTab() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlayerStatus>('all');
  const [playerToToggle, setPlayerToToggle] = useState<Player | null>(null);

  const totalPlayers = players.length;

  const activePlayers = useMemo(
    () => players.filter((player) => player.status === 'active').length,
    [players]
  );

  const inactivePlayers = useMemo(
    () => players.filter((player) => player.status === 'inactive').length,
    [players]
  );

  const bannedPlayers = useMemo(
    () => players.filter((player) => player.status === 'banned').length,
    [players]
  );

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return players.filter((player) => {
      const matchesSearch =
        player.pseudo.toLowerCase().includes(normalizedSearch) ||
        player.email.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ? true : player.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [players, search, statusFilter]);

  const openToggleModal = (player: Player) => {
    setPlayerToToggle(player);
  };

  const closeToggleModal = () => {
    setPlayerToToggle(null);
  };

  const confirmToggleBan = () => {
    if (!playerToToggle) return;

    setPlayers((current) =>
      current.map((player) => {
        if (player.id !== playerToToggle.id) return player;

        if (player.status === 'banned') {
          return {
            ...player,
            status: 'inactive',
          };
        }

        return {
          ...player,
          status: 'banned',
        };
      })
    );

    closeToggleModal();
  };

  return (
    <Stack gap="lg">
      <AccountsStats
        totalPlayers={totalPlayers}
        activePlayers={activePlayers}
        inactivePlayers={inactivePlayers}
        bannedPlayers={bannedPlayers}
      />

      <AccountsTable
        players={filteredPlayers}
        search={search}
        statusFilter={statusFilter}
        playerToToggle={playerToToggle}
        totalPlayers={totalPlayers}
        activePlayers={activePlayers}
        inactivePlayers={inactivePlayers}
        bannedPlayers={bannedPlayers}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onOpenToggleModal={openToggleModal}
        onCloseToggleModal={closeToggleModal}
        onConfirmToggleBan={confirmToggleBan}
      />
    </Stack>
  );
}