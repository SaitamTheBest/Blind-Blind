import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import ClassicMode from "./pages/Classic";
import { GameProvider } from "./components/games/context/GameContext";

function App() {
    return (
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
    );
}

export default App;
