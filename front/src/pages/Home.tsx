import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { Helmet } from "react-helmet";
import Autoplay from "embla-carousel-autoplay";
import AnnouncementCarousel from "../components/home/AnnouncementCarousel";
import classes from "../styles/home/Home.module.css";
import musicImage from "../res/classic_cover.png";
import artistImage from "../res/artist_cover.png";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

export default function Home() {
  const navigate = useNavigate();

  const [classicStatus, setClassicStatus] = useState<"Disponible" | "En cours" | "Jeu terminé">("Disponible");
  const [classicBadgeColor, setClassicBadgeColor] = useState<"green" | "yellow" | "red">("green");
  const [artistStatus, setArtistStatus] = useState<"Disponible" | "En cours" | "Jeu terminé">("Disponible");
  const [artistBadgeColor, setArtistBadgeColor] = useState<"green" | "yellow" | "red">("green");

  const isMobile = useMediaQuery("(max-width: 768px)");
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  const getTodayDate = (): string => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const savedMessages = localStorage.getItem("messages");
    const savedAttempts = localStorage.getItem("attempts");
    const savedRandomTrack = localStorage.getItem("randomTrack");
    const savedDate = localStorage.getItem("trackDate");
    const lastWinClassicDate = localStorage.getItem("lastWinClassicDate");

    const today = getTodayDate();

    if (savedRandomTrack && savedDate === today) {
      if (lastWinClassicDate === today) {
        setClassicStatus("Jeu terminé");
        setClassicBadgeColor("red");
      } else if (savedMessages || savedAttempts) {
        setClassicStatus("En cours");
        setClassicBadgeColor("yellow");
      }
    } else {
      setClassicStatus("Disponible");
      setClassicBadgeColor("green");
    }

    const artistMessages = localStorage.getItem("messages");
    const artistAttempts = localStorage.getItem("attempts");
    const artistDate = localStorage.getItem("artistDate");
    const artistLastWinArtistDate = localStorage.getItem("lastWinArtistDate");

    if (artistDate === today) {
      if (artistLastWinArtistDate === today) {
        setArtistStatus("Jeu terminé");
        setArtistBadgeColor("red");
      } else if (artistMessages || artistAttempts) {
        setArtistStatus("En cours");
        setArtistBadgeColor("yellow");
      }
    } else {
      setArtistStatus("Disponible");
      setArtistBadgeColor("green");
    }
  }, []);

  useEffect(() => {
    document.title = "Accueil - Blind-Blind";
  }, []);

  const getClassicButtonLabel = () => {
    switch (classicStatus) {
      case "Disponible":
        return "Jouer maintenant";
      case "En cours":
        return "Reprendre";
      case "Jeu terminé":
        return "Regarder";
      default:
        return "Indisponible";
    }
  };

  const getArtistButtonLabel = () => {
    switch (artistStatus) {
      case "Disponible":
        return "Jouer maintenant";
      case "En cours":
        return "Reprendre";
      case "Jeu terminé":
        return "Regarder";
      default:
        return "Indisponible";
    }
  };

  return (
    <>
      <Helmet>
        <title>Blind-Blind</title>
        <meta
          name="description"
          content="Jouez gratuitement au blind test musical le plus fun : Blind-Blind ! Devinez la chanson, affrontez vos amis et découvrez de nouveaux titres."
        />
      </Helmet>

      <div className={classes.homeContainer}>
        <Container
          size="xl"
          py={isMobile ? "md" : "lg"}
          style={{
            minHeight: "calc(100vh - 140px)",
            display: "flex",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <Grid gutter={28} align="stretch" style={{ width: "100%" }}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack
                gap="md"
                h="100%"
                style={{ minHeight: isMobile ? "auto" : 460 }}
              >
                <Box
                  style={{
                    paddingTop: isMobile ? 0 : 0,
                  }}
                >
                  <Title
                    className={classes.title}
                    order={1}
                    style={{
                      fontSize: isMobile ? "2.4rem" : "4rem",
                      lineHeight: 1.08,
                      fontWeight: 800,
                      textAlign: isMobile ? "center" : "left",
                    }}
                  >
                    Bienvenue sur
                    <br />
                    Blind-Blind!
                  </Title>
                </Box>

                <Paper
                  withBorder
                  shadow="sm"
                  p={isMobile ? "md" : "lg"}
                  radius="lg"
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Title order={3} ta="center" mb="md">
                    Annonces
                  </Title>

                  <Box
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <AnnouncementCarousel isMobile={Boolean(isMobile)} />
                  </Box>
                </Paper>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper
                withBorder
                shadow="sm"
                p={isMobile ? "md" : "xl"}
                radius="lg"
                h="100%"
                style={{
                  minHeight: isMobile ? "auto" : 460,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Title order={3} ta="center" mb="lg">
                  Mini-jeux
                </Title>

                <Carousel
                  slideSize="100%"
                  slideGap="md"
                  height="auto"
                  withControls={!isMobile}
                  withIndicators={false}
                  controlSize={30}
                  emblaOptions={{ loop: true }}
                  plugins={[autoplay.current]}
                  onMouseEnter={autoplay.current.stop}
                  onMouseLeave={() => autoplay.current.play()}
                >
                  <Carousel.Slide>
                    <Card
                      shadow="sm"
                      padding="md"
                      radius="md"
                      withBorder
                      onClick={() => navigate("/classic")}
                      style={{
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        maxWidth: 360,
                        margin: "12px auto",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      <CardSection
                        style={{
                          borderBottom: "1px solid #e9ecef",
                          overflow: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Image
                          src={musicImage}
                          alt="Blind test"
                          height={140}
                          fit="contain"
                          style={{
                            objectPosition: "center",
                            transform: "rotate(-3deg) scale(1.05)",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
                          }}
                        />
                      </CardSection>

                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} c="black">
                          Jouer au mode Classic !
                        </Text>
                        <Badge color={classicBadgeColor}>{classicStatus}</Badge>
                      </Group>

                      <Text size="sm" c="dimmed" ta="left" mb="md">
                        Le mode de base de Blind-Blind ! Tente de deviner la bonne chanson parmi plus de 200 titres disponibles.
                      </Text>

                      <Button
                        fullWidth
                        color={classicBadgeColor}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/classic");
                        }}
                      >
                        {getClassicButtonLabel()}
                      </Button>
                    </Card>
                  </Carousel.Slide>

                  <Carousel.Slide>
                    <Card
                      shadow="sm"
                      padding="md"
                      radius="md"
                      withBorder
                      onClick={() => navigate("/artists")}
                      style={{
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        maxWidth: 360,
                        margin: "12px auto",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      <CardSection
                        style={{
                          borderBottom: "1px solid #e9ecef",
                          overflow: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Image
                          src={artistImage}
                          alt="Blind test artistes"
                          height={140}
                          fit="contain"
                          style={{
                            backgroundColor: "white",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
                          }}
                        />
                      </CardSection>

                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} c="black">
                          Jouer au mode Artistes !
                        </Text>
                        <Badge color={artistBadgeColor}>{artistStatus}</Badge>
                      </Group>

                      <Text size="sm" c="dimmed" ta="left" mb="md">
                        Devine l’artiste du jour grâce à une image pixelisée et des indices progressifs.
                      </Text>

                      <Button
                        fullWidth
                        color={artistBadgeColor}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/artists");
                        }}
                      >
                        {getArtistButtonLabel()}
                      </Button>
                    </Card>
                  </Carousel.Slide>
                </Carousel>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </div>
    </>
  );
}