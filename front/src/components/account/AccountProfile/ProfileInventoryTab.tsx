import { Badge, Box, Button, Card, Group, Paper, SimpleGrid, Stack, Tabs, Text, Title } from "@mantine/core";
import { EquippedCosmetics, InventoryItem, InventorySection } from "./types";
import classes from "../../../styles/account/AuthenticationTitle.module.css";

type InventoryGridProps = {
  items: InventoryItem[];
  emptyLabel: string;
  onEquip?: (itemId: number) => void;
};


function InventoryGrid({ items, emptyLabel, onEquip }: InventoryGridProps) {
  if (items.length === 0) {
    return (
      <Paper withBorder radius="md" p="lg" className={classes.emptyState}>
        <Text ta="center" c="dimmed">
          {emptyLabel}
        </Text>
      </Paper>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {items.map((item) => (
        <Card key={item.id} withBorder radius="lg" p="md" className={classes.inventoryCard}>
          <Stack gap="sm">
            <Box className={classes.inventoryVisual}>
              {item.image ? (
                <img src={item.image} alt={item.name} className={classes.inventoryImage} />
              ) : (
                <Text c="dimmed" size="sm">
                  Aperçu
                </Text>
              )}
            </Box>

            <Group justify="space-between" align="center">
              <Text fw={600}>{item.name}</Text>
            </Group>

            <Button
              radius="xl"
              variant={item.equipped ? "light" : "filled"}
              disabled={item.equipped}
              onClick={() => onEquip?.(item.id)}
            >
              {item.equipped ? "Équipé" : "Équiper"}
            </Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}

type ProfileInventoryTabProps = {
  inventory?: InventorySection;
  equippedCosmetics?: EquippedCosmetics;
  onEquipBanner?: (itemId: number) => void;
  onEquipTitle?: (itemId: number) => void;
  onEquipAvatarBorder?: (itemId: number) => void;
};

export default function ProfileInventoryTab({
  inventory,
  onEquipBanner,
  onEquipTitle,
  onEquipAvatarBorder,
}: ProfileInventoryTabProps) {
  const banners = inventory?.banners ?? [];
  const titles = inventory?.titles ?? [];
  const avatarBorders = inventory?.avatarBorders ?? [];

  return (
    <Stack gap="lg">
      <div>
        <Title order={3}>Inventaire</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Gère tes bannières, titres et bordures d’avatar.
        </Text>
      </div>

      <Tabs defaultValue="banners" variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="banners">Bannières</Tabs.Tab>
          <Tabs.Tab value="titles">Titres</Tabs.Tab>
          <Tabs.Tab value="avatarBorders">Bordures avatar</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="banners" pt="lg">
          <InventoryGrid
            items={banners}
            emptyLabel="Aucune bannière débloquée pour le moment."
            onEquip={onEquipBanner}
          />
        </Tabs.Panel>

        <Tabs.Panel value="titles" pt="lg">
          <InventoryGrid
            items={titles}
            emptyLabel="Aucun titre débloqué pour le moment."
            onEquip={onEquipTitle}
          />
        </Tabs.Panel>

        <Tabs.Panel value="avatarBorders" pt="lg">
          <InventoryGrid
            items={avatarBorders}
            emptyLabel="Aucune bordure d’avatar débloquée pour le moment."
            onEquip={onEquipAvatarBorder}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}