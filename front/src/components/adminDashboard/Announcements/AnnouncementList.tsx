import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { Announcement } from "./types";

interface AnnouncementListProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

function truncateText(value: string, maxLength = 100): string {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function formatDate(value: string): string {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("fr-FR");
}

export default function AnnouncementList({
  announcements,
  onEdit,
  onDelete,
}: AnnouncementListProps) {
  const rows = announcements.map((announcement) => (
    <Table.Tr key={announcement.id_Announcement}>
      <Table.Td w={80}>
        <Text size="sm" fw={700} c="#1f2937">
          #{announcement.id_Announcement}
        </Text>
      </Table.Td>

      <Table.Td miw={420}>
        <div>
          <Group gap={6} mb={2}>
            <Text fw={700} size="sm" c="#111827">
              {announcement.title}
            </Text>

            {announcement.announcement_Type?.is_Important && (
              <Badge color="red" size="xs">
                IMPORTANT
              </Badge>
            )}
          </Group>

          <Text size="xs" c="#6b7280">
            {truncateText(announcement.short_Description, 110)}
          </Text>
        </div>
      </Table.Td>

      <Table.Td w={120}>
        <Badge
          variant="light"
          color={announcement.is_Published ? "green" : "orange"}
          size="md"
        >
          {announcement.is_Published ? "Publié" : "Brouillon"}
        </Badge>
      </Table.Td>

      <Table.Td miw={160}>
        <Badge variant="outline" color="blue">
          {announcement.announcement_Type?.label ?? `Type #${announcement.id_Announcement_Type}`}
        </Badge>
      </Table.Td>

      <Table.Td miw={140}>
        <Text size="sm" c="#4b5563" fw={500}>
          {announcement.slug}
        </Text>
      </Table.Td>

      <Table.Td miw={180}>
        <Text size="sm" c="#4b5563">
          {formatDate(announcement.publication_Date)}
        </Text>
      </Table.Td>

      <Table.Td w={110}>
        <Group gap={8} justify="flex-end" wrap="nowrap">
          <Tooltip label="Modifier">
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              onClick={() => onEdit(announcement)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Supprimer">
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              onClick={() => onDelete(announcement)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <ScrollArea>
        <Table
          striped
          highlightOnHover
          withTableBorder
          verticalSpacing="md"
          horizontalSpacing="md"
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Text fw={700} c="#111827">
                  ID
                </Text>
              </Table.Th>

              <Table.Th>
                <Text fw={700} c="#111827">
                  Annonce
                </Text>
              </Table.Th>

              <Table.Th>
                <Text fw={700} c="#111827">
                  Statut
                </Text>
              </Table.Th>

              <Table.Th>
                <Text fw={700} c="#111827">
                  Type
                </Text>
              </Table.Th>

              <Table.Th>
                <Text fw={700} c="#111827">
                  Slug
                </Text>
              </Table.Th>

              <Table.Th>
                <Text fw={700} c="#111827">
                  Publication
                </Text>
              </Table.Th>

              <Table.Th style={{ textAlign: "right" }}>
                <Text fw={700} c="#111827">
                  Actions
                </Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}