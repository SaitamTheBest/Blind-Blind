import React from "react";

export type SuggestionStatus = "pending" | "accepted" | "rejected";

export type SongSuggestion = {
  id: number;
  title: string;
  artist: string;
  status: SuggestionStatus;
};

export type SuggestionFormData = {
  title: string;
  artist: string;
  message: string;
};

export type AccountProfileViewProps = {
  username: string;
  setUsername: (value: string) => void;
  profileEmail: string;
  setProfileEmail: (value: string) => void;
  profileImage: string;
  resetRef: React.MutableRefObject<(() => void) | null>;
  onProfileImageChange: (file: File | null) => void;
  onGoToChangePassword: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onSaveProfile?: () => void;
  onSubmitSongSuggestion?: (data: SuggestionFormData) => void;
  songSuggestions?: SongSuggestion[];
};