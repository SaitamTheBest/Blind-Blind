import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import GuessInput from "../components/games/classic/GuessInput";
import AnswersTable from "../components/games/classic/AnswersTable";
import Popup from "../components/games/classic/SuccessPopup";

import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Alert,
} from "@mantine/core";

import { GameContext } from "../components/games/context/ClassicGameContext";
import HintImage from "../components/games/hint/HintImage";
import HintPerformer from "../components/games/hint/HintPerformer";

const API_URL =
  window._env_?.REACT_APP_URL_API ??
  process.env.REACT_APP_URL_API;

const GAME_DAY_ID = 1;

const ClassicMode: React.FC = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const [hintNatOpen, setHintNatOpen] = useState(false);
  const [hintImgOpen, setHintImgOpen] = useState(false);

  const [gameEnded, setGameEnded] = useState(false);

  const isMounted = useRef(false);

  const {
    messagesClassic,
    setMessagesClassic,
    attemptsClassic,
    setAttemptsClassic,
    solutionTrack,
    setSolutionTrackClassic,
  } = useContext(GameContext)!;

  /**
   * SONG OF THE DAY
   */
  const fetchSongOfTheDay = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/games/game-day/${GAME_DAY_ID}/response`
      );

      if (!res.ok) return;

      const data = await res.json();

      if (!isMounted.current) return;

      setSolutionTrackClassic(data?.track ?? null);
    } catch (e) {
      console.error("Song fetch failed", e);
    }
  }, [setSolutionTrackClassic]);

  /**
   * TRACK LIST
   */
  const fetchTracks = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/games/tracks`);
      if (!res.ok) return;

      const data = await res.json();

      console.log(data)

      if (!isMounted.current) return;

      setTracks(data);
    } catch (e) {
      console.error("Tracks fetch failed", e);
    }
  }, []);

  /**
   * GUESS + VERIFY
   */
  const handleGuessSubmit = async (track: any) => {

    if (!track || !solutionTrack) {
        return;
    }

    try {
        const res = await fetch(
        `${API_URL}/api/games/verify/track/${solutionTrack.id}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(track),
        }
        );

        const text = await res.text();

        if (!res.ok) {
            return;
        }

        const verification = JSON.parse(text);

        setAttemptsClassic((p) => p + 1);

        const guessDetails = {
        ...track,
        verification,
        };

        setMessagesClassic((prev) => {
        const updated = [guessDetails, ...prev];
        return updated;
        });

        setTracks((prev) =>
            prev.filter((t) => t.id_Track !== track.id_Track)
        );

        const isWin = verification?.name?.status === "correct";

        if (isWin) {
        setGameEnded(true);
        setTimeout(() => setPopupOpen(true), 1200);
        }
    } catch (e) {
        console.error("erreur =", e);
    }
    };

  /**
   * INIT
   */
  useEffect(() => {
    isMounted.current = true;

    document.title = "Classic - Blind-Blind";

    fetchSongOfTheDay();
    fetchTracks();

    return () => {
      isMounted.current = false;
    };
  }, [fetchSongOfTheDay, fetchTracks]);

  return (
    <Container size="xl" py="xl">
      <Paper p="xl" radius="lg" shadow="md">
        <Stack gap="lg">
          <Title ta="center">Devinez la chanson !</Title>

          <Text ta="center">Nombre d'essais : {attemptsClassic}</Text>

          {gameEnded && (
            <Alert color="green">
              Bravo ! Tu as trouvé la chanson.
            </Alert>
          )}

          <Group justify="center">
            <Button disabled={attemptsClassic < 3} onClick={() => setHintNatOpen(true)}>
              Indice artiste
            </Button>

            <Button disabled={attemptsClassic < 8} onClick={() => setHintImgOpen(true)}>
              Indice image
            </Button>
          </Group>

          <GuessInput
            onGuessSubmit={handleGuessSubmit}
            tracks={tracks}
            disabled={gameEnded}
          />

          <AnswersTable
            messagesClassic={messagesClassic}
            randomTrackClassic={solutionTrack}
          />
        </Stack>
      </Paper>

      <Popup
        isOpen={popupOpen}
        trackDetails={solutionTrack}
        onClose={() => setPopupOpen(false)}
      />

      <HintPerformer
        isOpen={hintNatOpen}
        performer_type={solutionTrack?.performer_type}
        onClose={() => setHintNatOpen(false)}
      />

      <HintImage
        isOpen={hintImgOpen}
        imageUrl={solutionTrack?.image_artist}
        onClose={() => setHintImgOpen(false)}
      />
    </Container>
  );
};

export default ClassicMode;