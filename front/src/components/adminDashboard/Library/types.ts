export type ArtistType = {
  id_Type_Artists: number;
  type: string;
};

export type Artist = {
  id_Artist: string;
  name: string;
  start_Date: string | null;
  last_Release: string | null;
  type_Artists: ArtistType | null;
  nationality: string | null;
  nb_Followers: number | null;
  image_Artists: string | null;
};

export type Genre = {
  id_Genre: number;
  libelle: string;
};

export type Track = {
  id_Track: string;
  name: string;
  release_Year: number | null;
  nb_Stream: number | null;
  feat: boolean;
  time: string | null;
  url_Source: string | null;
  genre: Genre | null;
  album?: Album | null;
};

export type Album = {
  id_Album: string;
  artist: Artist | null;
  tracks: Track[];
};