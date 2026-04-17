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

export type ArtistOption = SelectOption;
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
  imageArtists: string;
};

export type NewAlbumForm = {
  name: string;
  releaseYear: string;
  nbStream: string;
  imageAlbum: string;
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

export type SuggestionProcessingData = {
  suggestionId: number;
  form: SuggestionProcessingForm;
};

export type AdminSuggestionProcessPayload = {
  suggestionId: number;

  track: {
    name: string;
    releaseYear: number | null;
    popularity: number | null;
    time: string;
    urlSource: string;
    genreId: string | null;
    lyrics: string;
  };

  artist: {
    mode: ProcessingMode;
    existingArtistId: string | null;
    newArtist: {
      name: string;
      startDate: string | null;
      lastRelease: string | null;
      typeArtistId: string | null;
      nationality: string;
      nbFollowers: number | null;
      imageArtists: string;
    } | null;
  };

  album: {
    mode: ProcessingMode;
    existingAlbumId: string | null;
    newAlbum: {
      name: string;
      releaseYear: number | null;
      nbStream: number | null;
      imageAlbum: string;
      isSingle: boolean;
    } | null;
  };

  featurings: Array<{
    mode: ProcessingMode;
    existingArtistId: string | null;
    newArtist: {
      name: string;
      startDate: string | null;
      lastRelease: string | null;
      typeArtistId: string | null;
      nationality: string;
      nbFollowers: number | null;
      imageArtists: string;
    } | null;
  }>;
};

export const createEmptyNewArtistForm = (): NewArtistForm => ({
  name: "",
  startDate: null,
  lastRelease: null,
  typeArtistId: null,
  nationality: "",
  nbFollowers: "",
  imageArtists: "",
});

export const createEmptyNewAlbumForm = (): NewAlbumForm => ({
  name: "",
  releaseYear: "",
  nbStream: "",
  imageAlbum: "",
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

export const buildAdminSuggestionProcessPayload = (
  suggestionId: number,
  form: SuggestionProcessingForm
): AdminSuggestionProcessPayload => ({
  suggestionId,
  track: {
    name: form.trackName.trim(),
    releaseYear: form.releaseYear.trim() ? Number(form.releaseYear) : null,
    popularity: form.popularity.trim() ? Number(form.popularity) : null,
    time: form.duration.trim(),
    urlSource: form.urlSource.trim(),
    genreId: form.genreId,
    lyrics: form.lyrics.trim(),
  },
  artist: {
    mode: form.artistMode,
    existingArtistId:
      form.artistMode === "existing" ? form.existingArtistId : null,
    newArtist:
      form.artistMode === "new"
        ? {
            name: form.newArtist.name.trim(),
            startDate: form.newArtist.startDate,
            lastRelease: form.newArtist.lastRelease,
            typeArtistId: form.newArtist.typeArtistId,
            nationality: form.newArtist.nationality.trim(),
            nbFollowers: form.newArtist.nbFollowers.trim()
              ? Number(form.newArtist.nbFollowers)
              : null,
            imageArtists: form.newArtist.imageArtists.trim(),
          }
        : null,
  },
  album: {
    mode: form.albumMode,
    existingAlbumId:
      form.albumMode === "existing" ? form.existingAlbumId : null,
    newAlbum:
      form.albumMode === "new"
        ? {
            name: form.newAlbum.name.trim(),
            releaseYear: form.newAlbum.releaseYear.trim()
              ? Number(form.newAlbum.releaseYear)
              : null,
            nbStream: form.newAlbum.nbStream.trim()
              ? Number(form.newAlbum.nbStream)
              : null,
            imageAlbum: form.newAlbum.imageAlbum.trim(),
            isSingle: form.newAlbum.isSingle,
          }
        : null,
  },
  featurings: form.hasFeaturing
    ? form.featurings.map((featuring) => ({
        mode: featuring.mode,
        existingArtistId:
          featuring.mode === "existing" ? featuring.existingArtistId : null,
        newArtist:
          featuring.mode === "new"
            ? {
                name: featuring.newArtist.name.trim(),
                startDate: featuring.newArtist.startDate,
                lastRelease: featuring.newArtist.lastRelease,
                typeArtistId: featuring.newArtist.typeArtistId,
                nationality: featuring.newArtist.nationality.trim(),
                nbFollowers: featuring.newArtist.nbFollowers.trim()
                  ? Number(featuring.newArtist.nbFollowers)
                  : null,
                imageArtists: featuring.newArtist.imageArtists.trim(),
              }
            : null,
      }))
    : [],
});