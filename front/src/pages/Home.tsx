import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Text,
    Image,
    CardSection,
    Badge,
    Group,
    Button,
    Paper,
    Container,
    Title,
    Grid,
} from "@mantine/core";
// @ts-ignore
import classes from "../styles/home/Home.module.css";
import musicImage from "../res/classic_cover.png";
import artistImage from "../res/artist_cover.png";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

export default function Home() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"Disponible" | "En cours" | "Jeu terminé">("Disponible");
    const [badgeColor, setBadgeColor] = useState<"green" | "yellow" | "red">("green");

    const getTodayDate = (): string => new Date().toISOString().split("T")[0];

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        const savedAttempts = localStorage.getItem("attempts");
        const savedRandomTrack = localStorage.getItem("randomTrack");
        const savedDate = localStorage.getItem("trackDate");
        const lastWinDate = localStorage.getItem("lastWinDate");

        const today = getTodayDate();

        if (savedRandomTrack && savedDate === today) {
            if (lastWinDate === today) {
                setStatus("Jeu terminé");
                setBadgeColor("red");
            } else if (savedMessages || savedAttempts) {
                setStatus("En cours");
                setBadgeColor("yellow");
            }
        } else {
            setStatus("Disponible");
            setBadgeColor("green");
        }
    }, []);

    useEffect(() => {
        document.title = "Accueil - Blind-Blind";
    }, []);

    const getButtonLabel = () => {
        switch (status) {
            case "Disponible":
                return "Jouer maintenant";
            case "En cours":
                return "Reprendre";
            case "Jeu terminé":
                return "Observer";
            default:
                return "";
        }
    };

    const autoplay = useRef(Autoplay({ delay: 3000 }));

    return (
        <div className={classes.homeContainer}>
            <Container size="lg" py="xl">
                <Grid gutter={60} align="center">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Title className={classes.title} order={1}>
                            Bienvenue sur Blind-Blind!
                        </Title>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Container size="md" my={30} style={{ maxWidth: 600, width: "auto" }}>
                            <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
                                <Title order={3} ta="center" m={20} c={"dark"} className={classes.gamesTitle}>
                                    Mini-jeux
                                </Title>

                                <div
                                    style={{
                                        maxWidth: 500,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "0 auto",
                                    }}
                                >
                                    <Carousel
                                        slideSize="100%"
                                        slideGap="md"
                                        height="auto"
                                        withControls={false}
                                        withIndicators={true}
                                        controlSize={30}
                                        emblaOptions={{ loop: true }}
                                        plugins={[autoplay.current]}
                                        onMouseEnter={autoplay.current.stop}
                                        onMouseLeave={() => autoplay.current.play()}
                                        styles={{
                                            indicator: {
                                                backgroundColor: "#ccc"
                                            },
                                        }}
                                    >
                                        {/* Slide Classic */}
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
                                                    maxWidth: 350,
                                                    margin: "auto",
                                                    marginTop: "25px",
                                                    marginBottom: "25px",
                                                    border: "1px solid #ccc",
                                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "scale(1.03)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 8px 20px rgba(0, 0, 0, 0.2)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "scale(1)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            >
                                                <CardSection
                                                    style={{
                                                        borderBottom: "1px solid grey",
                                                        overflow: "hidden",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Image
                                                        src={musicImage}
                                                        alt="Blind test"
                                                        height={130}
                                                        fit="contain"
                                                        style={{
                                                            objectPosition: "center",
                                                            backgroundColor: "white",
                                                            transform: "rotate(-3deg) scale(1.05)",
                                                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                                                            borderRadius: "8px",
                                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                        }}
                                                    />
                                                </CardSection>

                                                <Group justify="space-between" mt="md" mb="xs">
                                                    <Text fw={700} c="black">
                                                        Jouer au mode Classic !
                                                    </Text>
                                                    <Badge color={badgeColor}>{status}</Badge>
                                                </Group>

                                                <Text size="sm" c="dimmed" ta="left" mb="md">
                                                    Le mode de base de Blind-Blind ! Tentez de deviner la bonne chanson parmi plus de 200 titres
                                                    disponibles. Vous aurez des propositions pour chaque recherche.
                                                </Text>

                                                <Button
                                                    fullWidth
                                                    color={badgeColor}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate("/classic");
                                                    }}
                                                >
                                                    {getButtonLabel()}
                                                </Button>
                                            </Card>
                                        </Carousel.Slide>

                                        {/* Slide Artistes */}
                                        <Carousel.Slide>
                                            <Card
                                                shadow="sm"
                                                padding="md"
                                                radius="md"
                                                withBorder
                                                style={{
                                                    backgroundColor: "#ffffff",
                                                    cursor: "pointer",
                                                    maxWidth: 400,
                                                    margin: "auto",
                                                    marginTop: "25px",
                                                    marginBottom: "25px",
                                                    border: "1px solid #ccc",
                                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "scale(1.03)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 8px 20px rgba(0, 0, 0, 0.2)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "scale(1)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            >
                                                <CardSection
                                                    style={{
                                                        borderBottom: "1px solid grey",
                                                        overflow: "hidden",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Image
                                                        src={artistImage}
                                                        alt="Blind test"
                                                        height={130}
                                                        fit="contain"
                                                        style={{
                                                            objectPosition: "center",
                                                            backgroundColor: "white",
                                                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                                                            borderRadius: "8px",
                                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                        }}
                                                    />
                                                </CardSection>

                                                <Group justify="space-between" mt="md" mb="xs">
                                                    <Text fw={700} c="black">
                                                        Jouer au mode Artistes !
                                                    </Text>
                                                    <Badge color="gray">En développement</Badge>
                                                </Group>

                                                <Text size="sm" c="dimmed" ta="left" mb="md">
                                                    Proche du classic, tentez de deviner le bon artiste parmi plus de 100 artistes disponibles.
                                                    Vous aurez des propositions pour chaque recherche.
                                                </Text>

                                                <Button fullWidth disabled color={"gray"}>
                                                    Prochainement
                                                </Button>
                                            </Card>
                                        </Carousel.Slide>
                                    </Carousel>
                                </div>
                            </Paper>
                        </Container>
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    );
}
