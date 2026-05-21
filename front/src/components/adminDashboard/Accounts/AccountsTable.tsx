import { useState } from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Collapse,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";

export type PlayerStatus = "active" | "inactive" | "banned" | "unknown";

export type Player = {
  id: string;
  pseudo: string;
  avatar: string;
  roleName: string;
  elo: number;
  rankName: string;
  status: PlayerStatus;
  createdAt: string;
  updatedAt: string;
};

type AccountsTableProps = {
  players: Player[];
  search: string;
  statusFilter: "all" | PlayerStatus;
  totalPlayers: number;
  activePlayers: number;
  inactivePlayers: number;
  bannedPlayers: number;
  loading?: boolean;
  deletingPlayerId?: string | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | PlayerStatus) => void;
  onDeletePlayer: (player: Player) => void;
};
function formatElo(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${value}`;
}

function getStatusLabel(status: PlayerStatus) {
  switch (status) {
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "banned":
      return "Banni";
    default:
      return "Inconnu";
  }
}

function getStatusColor(status: PlayerStatus) {
  switch (status) {
    case "active":
      return "teal";
    case "inactive":
      return "yellow";
    case "banned":
      return "red";
    default:
      return "gray";
  }
}

export default function AccountsTable({
  players,
  search,
  statusFilter,
  totalPlayers,
  activePlayers,
  inactivePlayers,
  bannedPlayers,
  loading = false,
  deletingPlayerId = null,
  onSearchChange,
  onStatusFilterChange,
  onDeletePlayer,
}: AccountsTableProps) {

  const [openedRowId, setOpenedRowId] = useState<string | null>(null);

  return (
    <Paper withBorder radius="sm" p="md" bg="white">
      <Group justify="space-between" align="end" mb="sm">
        <div>
          <Title order={2} c="black">
            Gestion des comptes
          </Title>
          <Text c="dimmed" size="sm" mt={2}>
            Clique sur un utilisateur pour afficher ses infos supplémentaires.
          </Text>
        </div>

        <Text size="sm" fw={700} c="blue">
          {players.length} résultat{players.length > 1 ? "s" : ""}
        </Text>
      </Group>

      <Group grow mb="sm">
        <TextInput
          radius="sm"
          placeholder="Rechercher par pseudo"
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
        />

        <Select
          radius="sm"
          data={[
            { value: "all", label: `Tous les statuts (${totalPlayers})` },
            { value: "active", label: `Actifs (${activePlayers})` },
            { value: "inactive", label: `Inactifs (${inactivePlayers})` },
            { value: "banned", label: `Bannis (${bannedPlayers})` },
          ]}
          value={statusFilter}
          onChange={(value) =>
            onStatusFilterChange((value as "all" | PlayerStatus) || "all")
          }
        />
      </Group>

      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Box
          px="sm"
          py={10}
          style={{
            borderBottom: "1px solid #e9ecef",
            background: "#f8f9fa",
          }}
        >
          <Text fw={700} size="sm" c="black">
            Utilisateur
          </Text>
        </Box>

        {players.length === 0 ? (
          <Box px="sm" py="md">
            <Text size="sm" c="dimmed" ta="center">
              {loading ? "Chargement des utilisateurs..." : "Aucun utilisateur trouvé."}
            </Text>
          </Box>
        ) : (
          <Stack gap={0}>
            {players.map((player) => {
              const isOpened = openedRowId === player.id;

              return (
                <Box
                  key={player.id}
                  style={{
                    borderBottom: "1px solid #e9ecef",
                    background: "#fff",
                  }}
                >
                  <Group
                    justify="space-between"
                    align="center"
                    wrap="nowrap"
                    px="sm"
                    py={10}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenedRowId((current) =>
                        current === player.id ? null : player.id
                      )
                    }
                  >
                    <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                      <Avatar
                        src={player.avatar || undefined}
                        radius="sm"
                        size={34}
                        color="gray"
                      >
                        {player.pseudo?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>

                      <Box style={{ minWidth: 0 }}>
                        <Text
                          fw={600}
                          size="sm"
                          c="black"
                          style={{
                            lineHeight: 1.1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {player.pseudo}
                        </Text>

                        <Text
                          size="xs"
                          c="dimmed"
                          style={{
                            lineHeight: 1.1,
                            marginTop: 3,
                          }}
                        >
                          {player.roleName || "Aucun rôle"}
                        </Text>
                      </Box>
                    </Group>

                    <Group gap="xs" align="center" wrap="nowrap">
                      <Badge
                        color={getStatusColor(player.status)}
                        variant="light"
                        radius="sm"
                        size="sm"
                      >
                        {getStatusLabel(player.status)}
                      </Badge>

                      <Box c="dimmed">
                        {isOpened ? (
                          <IconChevronUp size={16} />
                        ) : (
                          <IconChevronDown size={16} />
                        )}
                      </Box>
                    </Group>
                  </Group>

                  <Collapse in={isOpened}>
                    <Box
                      px="sm"
                      py={8}
                      style={{
                        background: "#f8f9fa",
                        borderTop: "1px solid #edf0f2",
                      }}
                    >
                      <Group justify="space-between" align="center" wrap="nowrap">
                        <Group gap="lg" wrap="wrap" style={{ minWidth: 0 }}>
                          <Text size="sm" c="black">
                            <Text span fw={600}>
                              Elo :
                            </Text>{" "}
                            {formatElo(player.elo)}
                          </Text>
                    
                          <Text size="sm" c="black">
                            <Text span fw={600}>
                              Rank :
                            </Text>{" "}
                            {player.rankName || "Non classé"}
                          </Text>
                    
                          <Text size="sm" c="black">
                            <Text span fw={600}>
                              Créé le :
                            </Text>{" "}
                            {player.createdAt || "—"}
                          </Text>
                    
                          <Text size="sm" c="black">
                            <Text span fw={600}>
                              Dernière mise à jour :
                            </Text>{" "}
                            {player.updatedAt || "—"}
                          </Text>
                        </Group>
                    
                        <Tooltip label="Supprimer le compte">
                          <ActionIcon
                            color="red"
                            variant="light"
                            radius="sm"
                            loading={deletingPlayerId === player.id}
                            onClick={() => onDeletePlayer(player)}
                            aria-label={`Supprimer le compte de ${player.pseudo}`}
                            style={{ flexShrink: 0 }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Stack>
        )}
      </Paper>
    </Paper>
  );
}