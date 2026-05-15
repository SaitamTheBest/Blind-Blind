export type SuggestionStatus = "pending" | "accepted" | "rejected";

export type SongSuggestion = {
  id: number;
  title: string;
  album?: string;
  artist: string;
  message?: string;
  proposedBy: string;
  status: SuggestionStatus;
  createdAt: string;
};

export type AddedSong = {
  id: string | number;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  addedFromSuggestionId?: number;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type ArtistOption = SelectOption & {
  imageArtists?: string | null;
};

export type AlbumOption = SelectOption & {
  artistId?: string;
  releaseYear?: number | null;
};

export type GenreOption = SelectOption;
export type TypeArtistOption = SelectOption;

export type ProcessingMode = "existing" | "new";

export type NewArtistForm = {
  name: string;
  startDate: string | null;
  lastRelease: string | null;
  typeArtistId: string | null;
  nationality: string;
  nbFollowers: string;
  imageArtists: File | null;
};

export type NewAlbumForm = {
  name: string;
  releaseYear: string;
  nbStream: string;
  imageAlbum: File | null;
  isSingle: boolean;
};

export type FeaturingArtist = {
  key: string;
  mode: ProcessingMode;
  existingArtistId: string | null;
  newArtist: NewArtistForm;
};

export type SuggestionProcessingForm = {
  existingAlbumId: string | null;
  albumMode: ProcessingMode;
  newAlbum: NewAlbumForm;

  existingArtistId: string | null;
  artistMode: ProcessingMode;
  newArtist: NewArtistForm;

  trackName: string;
  releaseYear: string;
  popularity: string;
  duration: string;
  urlSource: string;
  genreId: string | null;
  lyrics: string;
  hasFeaturing: boolean;
  featurings: FeaturingArtist[];
};

export const createEmptyNewArtistForm = (): NewArtistForm => ({
  name: "",
  startDate: null,
  lastRelease: null,
  typeArtistId: null,
  nationality: "",
  nbFollowers: "",
  imageArtists: null,
});

export const createEmptyNewAlbumForm = (): NewAlbumForm => ({
  name: "",
  releaseYear: "",
  nbStream: "",
  imageAlbum: null,
  isSingle: false,
});

export const createEmptyFeaturingArtist = (): FeaturingArtist => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  mode: "existing",
  existingArtistId: null,
  newArtist: createEmptyNewArtistForm(),
});

export const createEmptySuggestionProcessingForm = (): SuggestionProcessingForm => ({
  existingAlbumId: null,
  albumMode: "existing",
  newAlbum: createEmptyNewAlbumForm(),

  existingArtistId: null,
  artistMode: "existing",
  newArtist: createEmptyNewArtistForm(),

  trackName: "",
  releaseYear: "",
  popularity: "",
  duration: "",
  urlSource: "",
  genreId: null,
  lyrics: "",
  hasFeaturing: false,
  featurings: [],
});