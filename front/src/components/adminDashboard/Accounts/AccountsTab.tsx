import { useCallback, useEffect, useMemo, useState } from "react";
import { notifyError, notifySuccess } from "../../../utils/notify";
import { Alert, Loader, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { API_URL } from "../../../config";
import AccountsStats from "./AccountsStats";
import AccountsTable, { type Player, type PlayerStatus } from "./AccountsTable";
import DeleteAccountConfirmModal from "./DeleteAccountConfirmModal";

type ApiRank = {
  rank_Name?: string;
  rankName?: string;
  Rank_Name?: string;
};

type ApiRole = {
  role_Name?: string;
  roleName?: string;
  Role_Name?: string;
};

type ApiUser = {
  id_User?: string;
  idUser?: string;
  Id_User?: string;
  username?: string;
  userName?: string;
  Username?: string;
  avatar?: string;
  Avatar?: string;
  elo?: number;
  Elo?: number;
  rank?: ApiRank | null;
  Rank?: ApiRank | null;
  roles?: ApiRole | null;
  Roles?: ApiRole | null;
  status?: string | null;
  Status?: string | null;
  isActive?: boolean | null;
  IsActive?: boolean | null;
  isBanned?: boolean | null;
  IsBanned?: boolean | null;
  created_At?: string | null;
  createdAt?: string | null;
  Created_At?: string | null;
  updated_At?: string | null;
  updatedAt?: string | null;
  Updated_At?: string | null;
  [key: string]: unknown;
};

type ApiStats = {
  total_Users?: number;
  totalUsers?: number;
  Total_Users?: number;
  TotalUsers?: number;
  active_Users?: number;
  activeUsers?: number;
  Active_Users?: number;
  ActiveUsers?: number;
  inactive_Users?: number;
  inactiveUsers?: number;
  Inactive_Users?: number;
  InactiveUsers?: number;
  banned_Users?: number;
  bannedUsers?: number;
  Banned_Users?: number;
  BannedUsers?: number;
};

type StatsData = {
  totalPlayers: number;
  activePlayers: number;
  inactivePlayers: number;
  bannedPlayers: number;
};

function getStoredAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function toStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function firstDefined<T>(...values: (T | undefined | null)[]): T | undefined {
  return values.find((value): value is T => value !== undefined && value !== null);
}

function parseApiDate(value: string): Date | null {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

function formatApiDate(value: string): string {
  const parsed = parseApiDate(value);
  if (!parsed) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function isOlderThan30Days(value: string): boolean {
  const parsed = parseApiDate(value);
  if (!parsed) return false;

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays > 30;
}

function normalizeStatusFromApi(user: ApiUser): PlayerStatus {
  const explicitStatus = toStringValue(
    firstDefined(user.status, user.Status),
    ""
  ).toLowerCase();

  if (explicitStatus.includes("ban")) return "banned";
  if (explicitStatus.includes("inactive") || explicitStatus.includes("inactif")) return "inactive";
  if (explicitStatus.includes("active") || explicitStatus.includes("actif")) return "active";

  const isBanned = firstDefined(user.isBanned, user.IsBanned);
  if (typeof isBanned === "boolean" && isBanned) {
    return "banned";
  }

  const updatedAtRaw = toStringValue(
    firstDefined(user.updated_At, user.updatedAt, user.Updated_At),
    ""
  );

  if (updatedAtRaw) {
    return isOlderThan30Days(updatedAtRaw) ? "inactive" : "active";
  }

  const isActive = firstDefined(user.isActive, user.IsActive);
  if (typeof isActive === "boolean") {
    return isActive ? "active" : "inactive";
  }

  return "unknown";
}

function normalizeAvatar(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/9j/")) {
    return `data:image/jpeg;base64,${trimmed}`;
  }

  if (trimmed.startsWith("iVBORw0KGgo")) {
    return `data:image/png;base64,${trimmed}`;
  }

  if (trimmed.startsWith("R0lGOD")) {
    return `data:image/gif;base64,${trimmed}`;
  }

  return trimmed;
}

function mapApiUser(item: ApiUser, index: number): Player {
  const rank = item.rank ?? item.Rank;
  const role = item.roles ?? item.Roles;

  const id = toStringValue(
    firstDefined(item.id_User, item.idUser, item.Id_User),
    `temp-${index}`
  );

  const pseudo = toStringValue(
    firstDefined(item.username, item.userName, item.Username),
    `Utilisateur ${index + 1}`
  );

  const avatarRaw = toStringValue(firstDefined(item.avatar, item.Avatar), "");
  const avatar = normalizeAvatar(avatarRaw);

  const elo = toNumber(firstDefined(item.elo, item.Elo), 0);

  const rankName = toStringValue(
    firstDefined(rank?.rank_Name, rank?.rankName, rank?.Rank_Name),
    "Non classé"
  );

  const roleName = toStringValue(
    firstDefined(role?.role_Name, role?.roleName, role?.Role_Name),
    "Aucun rôle"
  );

  const createdAtRaw = toStringValue(
    firstDefined(item.created_At, item.createdAt, item.Created_At),
    ""
  );

  const updatedAtRaw = toStringValue(
    firstDefined(item.updated_At, item.updatedAt, item.Updated_At),
    ""
  );

  return {
    id,
    pseudo,
    avatar,
    elo,
    rankName,
    roleName,
    status: normalizeStatusFromApi(item),
    createdAt: formatApiDate(createdAtRaw),
    updatedAt: formatApiDate(updatedAtRaw),
  };
}

function extractUsersArray(payload: unknown): ApiUser[] {
  if (Array.isArray(payload)) return payload as ApiUser[];

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    const possibleArrays = [
      obj.data,
      obj.Data,
      obj.users,
      obj.Users,
      obj.items,
      obj.Items,
      obj.result,
      obj.Result,
    ];

    const found = possibleArrays.find(Array.isArray);
    if (Array.isArray(found)) return found as ApiUser[];
  }

  return [];
}

function mapStats(payload: ApiStats, fallbackPlayers: Player[]): StatsData {
  const fallbackActive = fallbackPlayers.filter((player) => player.status === "active").length;
  const fallbackInactive = fallbackPlayers.filter((player) => player.status === "inactive").length;
  const fallbackBanned = fallbackPlayers.filter((player) => player.status === "banned").length;

  return {
    totalPlayers: toNumber(
      firstDefined(
        payload.total_Users,
        payload.totalUsers,
        payload.Total_Users,
        payload.TotalUsers
      ),
      fallbackPlayers.length
    ),
    activePlayers: toNumber(
      firstDefined(
        payload.active_Users,
        payload.activeUsers,
        payload.Active_Users,
        payload.ActiveUsers
      ),
      fallbackActive
    ),
    inactivePlayers: toNumber(
      firstDefined(
        payload.inactive_Users,
        payload.inactiveUsers,
        payload.Inactive_Users,
        payload.InactiveUsers
      ),
      fallbackInactive
    ),
    bannedPlayers: toNumber(
      firstDefined(
        payload.banned_Users,
        payload.bannedUsers,
        payload.Banned_Users,
        payload.BannedUsers
      ),
      fallbackBanned
    ),
  };
}

export default function AccountsTab() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalPlayers: 0,
    activePlayers: 0,
    inactivePlayers: 0,
    bannedPlayers: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PlayerStatus>("all");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    const token = getStoredAccessToken();

    const response = await fetch(`${API_URL}/api/users/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Impossible de récupérer les utilisateurs.");
    }

    const result = await response.json();
    const usersArray = extractUsersArray(result);

    return usersArray.map(mapApiUser);
  }, []);

  const fetchStats = useCallback(async () => {
    const token = getStoredAccessToken();

    const response = await fetch(`${API_URL}/api/user-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Impossible de récupérer les stats.");
    }

    return (await response.json()) as ApiStats;
  }, []);

  const loadData = useCallback(async () => {
    setError("");
    setLoadingUsers(true);
    setLoadingStats(true);

    try {
      const [usersResult, statsResult] = await Promise.allSettled([
        fetchUsers(),
        fetchStats(),
      ]);

      let mappedPlayers: Player[] = [];

      if (usersResult.status === "fulfilled") {
        mappedPlayers = usersResult.value;
        setPlayers(mappedPlayers);
      } else {
        setPlayers([]);
      }

      if (statsResult.status === "fulfilled") {
        setStats(mapStats(statsResult.value, mappedPlayers));
      } else {
        setStats(mapStats({}, mappedPlayers));
      }

      if (
        usersResult.status === "rejected" &&
        statsResult.status === "rejected"
      ) {
        setError("Impossible de charger les utilisateurs et les statistiques.");
      } else if (usersResult.status === "rejected") {
        setError("Les stats sont chargées, mais les utilisateurs ont échoué.");
      } else if (statsResult.status === "rejected") {
        setError("Les utilisateurs sont chargés, mais les stats ont échoué.");
      }
    } catch {
      setPlayers([]);
      setStats({
        totalPlayers: 0,
        activePlayers: 0,
        inactivePlayers: 0,
        bannedPlayers: 0,
      });
      setError("Une erreur est survenue pendant le chargement.");
    } finally {
      setLoadingUsers(false);
      setLoadingStats(false);
    }
  }, [fetchUsers, fetchStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openDeletePlayerModal = useCallback((player: Player) => {
    setPlayerToDelete(player);
  }, []);

  const closeDeletePlayerModal = useCallback(() => {
    if (deletingPlayerId) return;
    setPlayerToDelete(null);
  }, [deletingPlayerId]);

  const confirmDeletePlayer = useCallback(async () => {
    if (!playerToDelete) return;

    const token = getStoredAccessToken();

    if (!token) {
      notifyError({
        title: "Erreur",
        message: "Aucun token trouvé. Reconnecte-toi.",
      });
      return;
    }

    setDeletingPlayerId(playerToDelete.id);

    try {
      const response = await fetch(
        `${API_URL}/api/users/delete/${playerToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Impossible de supprimer cet utilisateur.");
      }

      notifySuccess({
        title: "Compte supprimé",
        message: `Le compte de ${playerToDelete.pseudo} a bien été supprimé.`,
      });

      setPlayerToDelete(null);
      await loadData();
    } catch (error) {
      notifyError({
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue pendant la suppression.",
      });
    } finally {
      setDeletingPlayerId(null);
    }
  }, [loadData, playerToDelete]);

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return players.filter((player) => {
      const matchesSearch = player.pseudo.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : player.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [players, search, statusFilter]);

  const derivedStats = useMemo(() => {
    const fallbackActive = players.filter((player) => player.status === "active").length;
    const fallbackInactive = players.filter((player) => player.status === "inactive").length;
    const fallbackBanned = players.filter((player) => player.status === "banned").length;

    return {
      totalPlayers: stats.totalPlayers || players.length,
      activePlayers: stats.activePlayers || fallbackActive,
      inactivePlayers: stats.inactivePlayers || fallbackInactive,
      bannedPlayers: stats.bannedPlayers || fallbackBanned,
    };
  }, [players, stats]);

  const isLoading = loadingUsers || loadingStats;

  return (
    <Stack gap="md">
      {error ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          color="yellow"
          radius="sm"
          variant="light"
        >
          {error}
        </Alert>
      ) : null}

      <AccountsStats
        totalPlayers={derivedStats.totalPlayers}
        activePlayers={derivedStats.activePlayers}
        inactivePlayers={derivedStats.inactivePlayers}
        bannedPlayers={derivedStats.bannedPlayers}
      />

      {isLoading && players.length === 0 ? (
        <Stack align="center" gap="xs" py="lg">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            Chargement des comptes...
          </Text>
        </Stack>
      ) : (
        <AccountsTable
          players={filteredPlayers}
          search={search}
          statusFilter={statusFilter}
          totalPlayers={derivedStats.totalPlayers}
          activePlayers={derivedStats.activePlayers}
          inactivePlayers={derivedStats.inactivePlayers}
          bannedPlayers={derivedStats.bannedPlayers}
          loading={isLoading}
          deletingPlayerId={deletingPlayerId}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onDeletePlayer={openDeletePlayerModal}
        />
      )}

      <DeleteAccountConfirmModal
        opened={Boolean(playerToDelete)}
        player={playerToDelete}
        loading={Boolean(deletingPlayerId)}
        onClose={closeDeletePlayerModal}
        onConfirm={confirmDeletePlayer}
      />
      
    </Stack>
  );
}