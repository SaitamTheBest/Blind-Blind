import React from "react";
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import ClassicMode from "./pages/Classic";
import ArtistMode from "./pages/Artist";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";

import { GameProvider as ClassicGameProvider } from "./components/games/context/ClassicGameContext";
import { ArtistGameProvider } from "./components/games/context/ArtistGameContext";

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import "./styles/global.css";

function App() {
    return (
        <MantineProvider>
            <ModalsProvider>
                <Notifications />
                <Router>
                    <Header />

                    <div style={{ minHeight: 'calc(100vh - 118px)' }}>
                        <Routes>
                            <Route path="/" element={<Home />} />

                            {/* Account */}
                            <Route path="/account" element={<Account />} />

                            {/* MODE CLASSIC */}
                            <Route
                                path="/classic"
                                element={
                                    <ClassicGameProvider>
                                        <ClassicMode />
                                    </ClassicGameProvider>
                                }
                            />

                            {/* MODE ARTISTS */}
                            <Route
                                path="/artists"
                                element={
                                    <ArtistGameProvider>
                                        <ArtistMode />
                                    </ArtistGameProvider>
                                }
                            />

                            {/* Admin Dashboard */}
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Routes>
                    </div>

                    <Footer />
                </Router>
            </ModalsProvider>
        </MantineProvider>
    );
}

export default App;
