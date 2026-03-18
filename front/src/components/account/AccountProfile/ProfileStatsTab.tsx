import { Badge, Group, Paper, SimpleGrid, Text, ThemeIcon, Title } from "@mantine/core";
import { IconMail, IconMusic, IconTrophy } from "@tabler/icons-react";
import classes from "../../../styles/account/AuthenticationTitle.module.css";

export default function ProfileStatsTab() {
  return (
    <>
      <div>
        <Title order={3}>Statistiques</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Un aperçu rapide de ton activité.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Paper withBorder radius="lg" p="md" className={classes.statCard}>
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Parties jouées
            </Text>
            <ThemeIcon variant="light" radius="xl">
              <IconMusic size={16} />
            </ThemeIcon>
          </Group>
          <Title order={3} mt="sm">
            128
          </Title>
        </Paper>

        <Paper withBorder radius="lg" p="md" className={classes.statCard}>
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Meilleur rang
            </Text>
            <ThemeIcon variant="light" color="yellow" radius="xl">
              <IconTrophy size={16} />
            </ThemeIcon>
          </Group>
          <Title order={3} mt="sm">
            Top 12
          </Title>
        </Paper>

        <Paper withBorder radius="lg" p="md" className={classes.statCard}>
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Email vérifié
            </Text>
            <ThemeIcon variant="light" color="blue" radius="xl">
              <IconMail size={16} />
            </ThemeIcon>
          </Group>
          <Badge mt="sm" color="green" variant="light" size="lg">
            Oui
          </Badge>
        </Paper>
      </SimpleGrid>
    </>
  );
}