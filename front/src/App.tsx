import React, { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import ClassicMode from "./pages/Classic";
import ArtistMode from "./pages/Artist";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./utils/AdminRoute";

import { GameProvider as ClassicGameProvider } from "./components/games/context/ClassicGameContext";
import { ArtistGameProvider } from "./components/games/context/ArtistGameContext";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { tryRefreshSessionOnAppStart } from "./utils/authSession";
import "./styles/global.css";

function App() {
  const [isAuthBootstrapped, setIsAuthBootstrapped] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      await tryRefreshSessionOnAppStart();
      window.dispatchEvent(new Event("authChanged"));
      setIsAuthBootstrapped(true);
    };

    bootstrapAuth();
  }, []);

  if (!isAuthBootstrapped) {
    return null;
  }

  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications position="top-right" zIndex={9999} />
        <Router>
          <div className="app-shell">
            <Header />

            <main className="app-main">
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
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;