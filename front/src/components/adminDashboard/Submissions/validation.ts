import type { SuggestionProcessingForm } from "./types";

export type ProcessingValidationResult = {
  isValid: boolean;
  errors: string[];
};

function isPositiveInteger(value: string): boolean {
  if (!value.trim()) return false;
  return /^\d+$/.test(value.trim()) && Number(value.trim()) > 0;
}

function isYear(value: string): boolean {
  if (!value.trim()) return false;
  return /^\d{4}$/.test(value.trim());
}

function isDuration(value: string): boolean {
  if (!value.trim()) return false;

  // Accepte mm:ss ou hh:mm:ss
  return /^(\d{2}:)?\d{2}:\d{2}$/.test(value.trim());
}

function isOptionalImageSource(value: string): boolean {
  const trimmed = value.trim();

  if (!trimmed) return true;

  // On enlève les espaces et retours ligne éventuels
  const normalized = trimmed.replace(/\s/g, "");

  // 1) Accepte les Data URL :
  // data:image/jpeg;base64,/9j/4AAQ...
  const isDataUrlBase64 =
    /^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(normalized);

  if (isDataUrlBase64) return true;

  // 2) Accepte les base64 "bruts" :
  // /9j/4AAQSkZJRgABAQ...
  // iVBORw0KGgo...
  // R0lGODlh...
  const isRawBase64 =
    /^[A-Za-z0-9+/]+={0,2}$/.test(normalized) && normalized.length > 100;

  if (isRawBase64) return true;

  // 3) Accepte les URL classiques
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function validateSuggestionProcessingForm(
  form: SuggestionProcessingForm
): ProcessingValidationResult {
  const errors: string[] = [];

  if (!form.trackName.trim()) {
    errors.push("Le nom de la track est obligatoire.");
  }

  if (!form.releaseYear.trim()) {
    errors.push("L’année de sortie de la track est obligatoire.");
  } else if (!isYear(form.releaseYear)) {
    errors.push("L’année de sortie doit être au format AAAA.");
  }

  if (!form.genreId) {
    errors.push("Le genre de la track est obligatoire.");
  }

  if (form.popularity.trim() && !isPositiveInteger(form.popularity)) {
    errors.push("La popularité doit être un nombre entier positif.");
  }

  if (form.duration.trim() && !isDuration(form.duration)) {
    errors.push("La durée doit être au format mm:ss ou hh:mm:ss.");
  }

  if (!isOptionalImageSource(form.urlSource)) {
    errors.push("L’URL source ou l’image n’est pas valide.");
  }

  if (form.artistMode === "existing") {
    if (!form.existingArtistId) {
      errors.push("Tu dois sélectionner un artiste existant.");
    }
  } else {
    if (!form.newArtist.name.trim()) {
      errors.push("Le nom du nouvel artiste principal est obligatoire.");
    }

    if (!form.newArtist.typeArtistId) {
      errors.push("Le type du nouvel artiste principal est obligatoire.");
    }

    if (
      form.newArtist.nbFollowers.trim() &&
      !isPositiveInteger(form.newArtist.nbFollowers)
    ) {
      errors.push(
        "Le nombre de followers de l’artiste principal doit être un entier positif."
      );
    }

    if (
      form.newArtist.imageArtists.trim() &&
      !isOptionalImageSource(form.newArtist.imageArtists)
    ) {
      errors.push(
        "L’image du nouvel artiste principal doit être une URL valide ou une chaîne base64 valide."
      );
    }
  }

  if (form.albumMode === "existing") {
    if (!form.existingAlbumId) {
      errors.push("Tu dois sélectionner un album existant.");
    }
  } else {
    if (!form.newAlbum.name.trim()) {
      errors.push("Le nom du nouvel album est obligatoire.");
    }

    if (!form.newAlbum.releaseYear.trim()) {
      errors.push("L’année de sortie du nouvel album est obligatoire.");
    } else if (!isYear(form.newAlbum.releaseYear)) {
      errors.push("L’année de sortie de l’album doit être au format AAAA.");
    }

    if (
      form.newAlbum.nbStream.trim() &&
      !isPositiveInteger(form.newAlbum.nbStream)
    ) {
      errors.push("Le nombre de streams de l’album doit être un entier positif.");
    }

    if (
      form.newAlbum.imageAlbum.trim() &&
      !isOptionalImageSource(form.newAlbum.imageAlbum)
    ) {
      errors.push(
        "L’image du nouvel album doit être une URL valide ou une chaîne base64 valide."
      );
    }
  }

  if (form.hasFeaturing) {
    if (form.featurings.length === 0) {
      errors.push("Ajoute au moins un featuring ou désactive l’option.");
    }

    form.featurings.forEach((featuring, index) => {
      const position = index + 1;

      if (featuring.mode === "existing") {
        if (!featuring.existingArtistId) {
          errors.push(
            `Tu dois sélectionner un artiste existant pour le featuring #${position}.`
          );
        }
      } else {
        if (!featuring.newArtist.name.trim()) {
          errors.push(`Le nom du featuring #${position} est obligatoire.`);
        }

        if (!featuring.newArtist.typeArtistId) {
          errors.push(`Le type du featuring #${position} est obligatoire.`);
        }

        if (
          featuring.newArtist.nbFollowers.trim() &&
          !isPositiveInteger(featuring.newArtist.nbFollowers)
        ) {
          errors.push(
            `Le nombre de followers du featuring #${position} doit être un entier positif.`
          );
        }

        if (
          featuring.newArtist.imageArtists.trim() &&
          !isOptionalImageSource(featuring.newArtist.imageArtists)
        ) {
          errors.push(
            `L’image du featuring #${position} doit être une URL valide ou une chaîne base64 valide.`
          );
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}