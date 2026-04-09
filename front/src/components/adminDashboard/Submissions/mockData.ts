import type { AddedSong, SongSuggestion } from "./types";

export const initialSuggestions: SongSuggestion[] = [
  {
    id: 1,
    title: "Numb",
    artist: "Linkin Park",
    message: "Super connue, parfaite pour le jeu.",
    proposedBy: "Enzo_LaCrocs",
    status: "pending",
    createdAt: "2026-03-20",
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    message: "J'écoute ça en boucle en ce moment, ça serait top !",
    proposedBy: "TestPlayer",
    status: "pending",
    createdAt: "2026-03-21",
  },
  {
    id: 3,
    title: "Believer",
    artist: "Imagine Dragons",
    message: "",
    proposedBy: "XX_Shadow_XX",
    status: "rejected",
    createdAt: "2026-03-18",
  },
];

export const initialAddedSongs: AddedSong[] = [
  {
    id: 1,
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    releaseDate: "1991-09-10",
  },
];