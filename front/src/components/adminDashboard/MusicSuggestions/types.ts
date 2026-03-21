export type SuggestionStatus = "pending" | "accepted" | "rejected";

export type SongSuggestion = {
  id: number;
  title: string;
  artist: string;
  message?: string;
  proposedBy: string;
  status: SuggestionStatus;
  createdAt: string;
};

export type AddedSong = {
  id: number;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  addedFromSuggestionId?: number;
};