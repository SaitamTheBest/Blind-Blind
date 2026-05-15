import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { API_URL } from "../../config";
import type { Announcement } from "./types";

interface AnnouncementCardProps {
  announcement: Announcement;
  onOpen?: (announcement: Announcement) => void;
}

function getImageSrc(base64: string): string {
  if (!base64) {
    return "";
  }

  return `data:image/jpeg;base64,${base64}`;
}

function formatDate(value: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function truncateText(value: string, maxLength = 180): string {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

export default function AnnouncementCard({
  announcement,
  onOpen,
}: AnnouncementCardProps) {
  const imageSrc = getImageSrc(announcement.cover_Image);
  const hasCover = Boolean(imageSrc);
  const isImportant = Boolean(announcement.announcement_Type?.is_Important);

  return (
    <Box
      style={{
        width: "100%",
        paddingTop: isImportant ? 12 : 0,
      }}
    >
      <Card
        withBorder
        radius="lg"
        shadow="sm"
        p={0}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 620,
          minHeight: 260,
          margin: "0 auto",
          background: "#fff",
          overflow: "visible",
        }}
      >
        {isImportant && (
          <Badge
            color="red"
            size="md"
            radius="sm"
            leftSection={<IconSparkles size={13} />}
            style={{
              position: "absolute",
              top: -12,
              right: 24,
              zIndex: 5,
              boxShadow: "0 8px 18px rgba(255, 0, 0, 0.22)",
            }}
          >
            Important
          </Badge>
        )}

        {hasCover ? (
  <Group
    align="stretch"
    gap={0}
    wrap="nowrap"
    style={{
      minHeight: 260,
      overflow: "hidden",
      borderRadius: 16,
    }}
  >
    <Box
      style={{
        width: 260,
        minWidth: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
        borderRight: "1px solid #e5e7eb",
      }}
    >
      <Box
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src={imageSrc}
          alt={announcement.title}
          w="100%"
          h="100%"
          fit="contain"
          style={{
            display: "block",
          }}
        />
      </Box>
    </Box>

    <Stack
      gap="sm"
      p="lg"
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Title order={4} lineClamp={2}>
          {announcement.title}
        </Title>

        {announcement.announcement_Type?.label && (
          <Badge variant="light" color="gray" style={{ flexShrink: 0 }}>
            {announcement.announcement_Type.label}
          </Badge>
        )}
      </Group>

      <Text size="sm" c="dimmed">
        {formatDate(announcement.publication_Date)}
      </Text>

      <Text size="sm" c="dimmed" lineClamp={4} style={{ flex: 1 }}>
        {truncateText(
          announcement.short_Description || announcement.content,
          210
        )}
      </Text>

      <Button
        fullWidth
        color="indigo"
        variant="filled"
        onClick={() => onOpen?.(announcement)}
        mt="auto"
      >
        Lire l’annonce
      </Button>
    </Stack>
  </Group>
) : (
  <Stack
    gap="sm"
    p="xl"
    style={{
      minHeight: 260,
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <Title order={4} lineClamp={2}>
        {announcement.title}
      </Title>

      {announcement.announcement_Type?.label && (
        <Badge variant="light" color="gray" style={{ flexShrink: 0 }}>
          {announcement.announcement_Type.label}
        </Badge>
      )}
    </Group>

    <Text size="sm" c="dimmed">
      {formatDate(announcement.publication_Date)}
    </Text>

    <Text size="sm" c="dimmed" lineClamp={5} style={{ flex: 1 }}>
      {truncateText(
        announcement.short_Description || announcement.content,
        260
      )}
    </Text>

    <Button
      fullWidth
      color="indigo"
      variant="filled"
      onClick={() => onOpen?.(announcement)}
      mt="auto"
    >
      Lire l’annonce
    </Button>
  </Stack>
)}
      </Card>
    </Box>
  );
}