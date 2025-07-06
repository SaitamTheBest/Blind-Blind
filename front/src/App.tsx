import React from "react";
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import ClassicMode from "./pages/Classic";
import { GameProvider } from "./components/games/context/GameContext";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

function App() {
    return (
        <MantineProvider>
            <ModalsProvider>
                <Notifications />
                <GameProvider>
                    <Router>
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/classic" element={<ClassicMode />} />
                        </Routes>
                        <Footer />
                    </Router>
                </GameProvider>
            </ModalsProvider>
        </MantineProvider>
    );
}

export default App;
