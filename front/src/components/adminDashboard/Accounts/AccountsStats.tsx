import { Card, Group, RingProgress, SimpleGrid, Stack, Text } from "@mantine/core";
import {
  IconBan,
  IconBolt,
  IconClockHour4,
  IconUsers,
} from "@tabler/icons-react";

type AccountsStatsProps = {
  totalPlayers: number;
  activePlayers: number;
  inactivePlayers: number;
  bannedPlayers: number;
};

type StatCardProps = {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  percent: number;
};

function StatCard({ label, value, color, icon, percent }: StatCardProps) {
  return (
    <Card
      withBorder
      radius="sm"
      p="md"
      style={{
        background: "#fff",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Stack gap={2}>
          <Text size="sm" c="dimmed" fw={500}>
            {label}
          </Text>

          <Text size="2rem" fw={800} c="dark" style={{ lineHeight: 1 }}>
            {value}
          </Text>
        </Stack>

        <RingProgress
          size={54}
          thickness={6}
          roundCaps
          sections={[{ value: percent, color }]}
          label={<Group justify="center" align="center" gap={0}>{icon}</Group>}
        />
      </Group>
    </Card>
  );
}

export default function AccountsStats({
  totalPlayers,
  activePlayers,
  inactivePlayers,
  bannedPlayers,
}: AccountsStatsProps) {
  const safePercent = (value: number) =>
    totalPlayers > 0 ? Math.round((value / totalPlayers) * 100) : 0;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="sm">
      <StatCard
        label="Nombre de joueurs"
        value={totalPlayers}
        color="blue"
        icon={<IconUsers size={16} color="var(--mantine-color-blue-6)" />}
        percent={100}
      />

      <StatCard
        label="Joueurs actifs"
        value={activePlayers}
        color="teal"
        icon={<IconBolt size={16} color="var(--mantine-color-teal-6)" />}
        percent={safePercent(activePlayers)}
      />

      <StatCard
        label="Joueurs inactifs"
        value={inactivePlayers}
        color="yellow"
        icon={<IconClockHour4 size={16} color="var(--mantine-color-yellow-7)" />}
        percent={safePercent(inactivePlayers)}
      />

      <StatCard
        label="Joueurs bannis"
        value={bannedPlayers}
        color="red"
        icon={<IconBan size={16} color="var(--mantine-color-red-6)" />}
        percent={safePercent(bannedPlayers)}
      />
    </SimpleGrid>
  );
}