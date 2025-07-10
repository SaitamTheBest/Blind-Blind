import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Text, Image, CardSection, Badge, Group, Button } from '@mantine/core';
import "../styles/home/home.css";
import musicImage from '../res/classic_cover.png';

export default function Home() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"Disponible" | "En cours" | "Jeu terminé">("Disponible");
    const [badgeColor, setBadgeColor] = useState<"green" | "yellow" | "red">("green");

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        const savedAttempts = localStorage.getItem("attempts");
        const savedRandomTrack = localStorage.getItem("randomTrack");
        const savedDate = localStorage.getItem("trackDate");
        const lastWinDate = localStorage.getItem('lastWinDate');

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

    return (
        <div>
            <div className="home">
                <Card
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                    onClick={() => navigate('/classic')}
                    style={{
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        maxWidth: 400,
                        margin: '0 auto',
                        border: '1px solid #ccc',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <CardSection
                        style={{
                            borderBottom: '1px solid grey',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            src={musicImage}
                            alt="Blind test"
                            height={130}
                            fit="contain"
                            style={{
                                objectPosition: 'center',
                                backgroundColor: 'white',
                                transform: 'rotate(-3deg) scale(1.05)',
                                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
                        disponibles.
                        Vous aurez des propositions pour chaque recherche.
                    </Text>

                    <Button
                        fullWidth
                        color={badgeColor}
                        onClick={(e) => {
                            e.stopPropagation(); // Évite double navigation
                            navigate('/classic');
                        }}
                    >
                        {getButtonLabel()}
                    </Button>
                </Card>
            </div>
        </div>
    );
}
