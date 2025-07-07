import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Text, Image, CardSection } from '@mantine/core';
import "../styles/home/home.css";
import musicImage from '../res/classic_cover.png'; 

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Accueil - Blind-Blind";
    }, []);

    return (
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
                    maxWidth: 480,
                    margin: '0 auto',
                    border: '1px solid #ccc',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            >
                <CardSection style={{ borderBottom: '2px solid black' }}>
                    <Image
                        src={musicImage}
                        alt="Blind test"
                        height={130}
                        fit="contain" // le plus safe pour ne rien couper
                        style={{ objectPosition: 'center', backgroundColor: 'white' }}
                    />
                </CardSection>

                <Text fw={700} fz="xl" mt="md" ta="center" c="black">
                    Jouer au mode Classic !
                </Text>

                <Text fz="sm" mt="xs" ta="center" c="dimmed">
                    Clique ici pour deviner la chanson du jour en te basant sur différents indices 🎵
                </Text>
            </Card>
        </div>
    );
}
