import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Center,
  Group,
  Image,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconAlertCircle, IconSpeakerphone, IconSparkles } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";
import AnnouncementCard from "./AnnouncementCard";
import { getPublishedAnnouncements } from "./api";
import type { Announcement } from "./types";
import AnnouncementImageFrame from "./AnnouncementImageFrame";

interface AnnouncementCarouselProps {
  isMobile: boolean;
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

  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnnouncementCarousel({ isMobile }: AnnouncementCarouselProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const autoplay = useRef(
    Autoplay({
      delay: 4500,
    })
  );

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublishedAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les annonces."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadAnnouncements();
  }, []);

  const slides = useMemo(() => {
    return announcements.map((announcement) => (
      <Carousel.Slide key={announcement.id_Announcement}>
        <AnnouncementCard
          announcement={announcement}
          onOpen={(item) => setSelectedAnnouncement(item)}
        />
      </Carousel.Slide>
    ));
  }, [announcements]);

  if (loading) {
    return (
      <Center style={{ width: "100%", minHeight: 220 }}>
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md" w="100%">
        {error}
      </Alert>
    );
  }

  if (announcements.length === 0) {
    return (
      <Center style={{ width: "100%", minHeight: 220 }}>
        <Stack gap={6} align="center">
          <IconSpeakerphone size={22} />
          <Text fw={600} ta="center">
            Aucune annonce disponible
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Rien à signaler pour le moment.
          </Text>
        </Stack>
      </Center>
    );
  }

  const hasMultipleSlides = announcements.length > 1;
  const selectedImageSrc = selectedAnnouncement
  ? getImageSrc(selectedAnnouncement.cover_Image)
  : null;
  const selectedIsImportant = Boolean(selectedAnnouncement?.announcement_Type?.is_Important);

  return (
    <>
      <Carousel
        slideSize="100%"
        slideGap="md"
        withControls={!isMobile && hasMultipleSlides}
        withIndicators={hasMultipleSlides}
        controlSize={32}
        emblaOptions={{
          loop: hasMultipleSlides,
          align: "center",
        }}
        plugins={hasMultipleSlides ? [autoplay.current] : []}
        onMouseEnter={() => {
          if (hasMultipleSlides) {
            autoplay.current.stop();
          }
        }}
        onMouseLeave={() => {
          if (hasMultipleSlides) {
            autoplay.current.reset();
          }
        }}
        style={{ width: "100%" }}
      >
        {slides}
      </Carousel>

      <Modal
        opened={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        centered
        size="xl"
        padding="xl"
        radius="lg"
        title={selectedAnnouncement?.title || "Annonce"}
      >
        {selectedAnnouncement && (
          <Group align="stretch" gap="xl" wrap={isMobile ? "wrap" : "nowrap"}>
            {selectedImageSrc && (
              <Box
                style={{
                  width: isMobile ? "100%" : 320,
                  minWidth: isMobile ? "100%" : 320,
                }}
              >
                <AnnouncementImageFrame
                  src={selectedImageSrc}
                  alt={selectedAnnouncement.title}
                  width={isMobile ? 220 : 320}
                  height={isMobile ? 220 : 320}
                  radius={12}
                />
              </Box>
            )}

            <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
              <Group justify="space-between" align="flex-start">
                <Group gap="xs">
                  {selectedAnnouncement.announcement_Type?.label && (
                    <Badge variant="light" color="gray">
                      {selectedAnnouncement.announcement_Type.label}
                    </Badge>
                  )}

                  {selectedIsImportant && (
                    <Badge color="red" leftSection={<IconSparkles size={12} />}>
                      Important
                    </Badge>
                  )}
                </Group>
                
                <Text size="sm" c="dimmed" ta="right">
                  {formatDate(selectedAnnouncement.publication_Date)}
                </Text>
              </Group>
                
              {selectedAnnouncement.short_Description && (
                <Text fw={700} size="lg" style={{ lineHeight: 1.45 }}>
                  {selectedAnnouncement.short_Description}
                </Text>
              )}

              <Box
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: 16,
                }}
              >
                <Text
                  size="md"
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedAnnouncement.content}
                </Text>
              </Box>
            </Stack>
          </Group>
        )}
      </Modal>
    </>
  );
}