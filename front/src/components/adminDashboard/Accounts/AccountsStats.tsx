import { Card, Group, Text, Title } from '@mantine/core';

type AccountsStatsProps = {
  totalPlayers: number;
  activePlayers: number;
  inactivePlayers: number;
  bannedPlayers: number;
};

export default function AccountsStats({
  totalPlayers,
  activePlayers,
  inactivePlayers,
  bannedPlayers,
}: AccountsStatsProps) {
  return (
    <Group align="stretch" grow>
      <Card withBorder radius="md" padding="lg">
        <Text c="dimmed" size="sm">
          Nombre de joueurs
        </Text>
        <Title order={2} mt="xs" c="black">
          {totalPlayers}
        </Title>
      </Card>

      <Card withBorder radius="md" padding="lg">
        <Text c="dimmed" size="sm">
          Joueurs actifs
        </Text>
        <Title order={2} mt="xs" c="black">
          {activePlayers}
        </Title>
      </Card>

      <Card withBorder radius="md" padding="lg">
        <Text c="dimmed" size="sm">
          Joueurs inactifs
        </Text>
        <Title order={2} mt="xs" c="black">
          {inactivePlayers}
        </Title>
      </Card>

      <Card withBorder radius="md" padding="lg">
        <Text c="dimmed" size="sm">
          Joueurs bannis
        </Text>
        <Title order={2} mt="xs" c="black">
          {bannedPlayers}
        </Title>
      </Card>
    </Group>
  );
}