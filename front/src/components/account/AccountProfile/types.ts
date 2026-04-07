import React from "react";

export type SuggestionStatus = "pending" | "accepted" | "rejected";

export type SongSuggestion = {
  id: number;
  title: string;
  album?: string;
  artist: string;
  status: SuggestionStatus;
  message?: string;
  createdAt?: string;
};

export type SuggestionFormData = {
  title: string;
  album?: string;
  artist: string;
  message?: string;
};

export type InventoryItem = {
  id: number;
  name: string;
  image?: string;
  equipped?: boolean;
};

export type InventorySection = {
  banners: InventoryItem[];
  titles: InventoryItem[];
  avatarBorders: InventoryItem[];
};

export type EquippedCosmetics = {
  banner?: InventoryItem | null;
  title?: InventoryItem | null;
  avatarBorder?: InventoryItem | null;
};

export type AccountProfileViewProps = {
  username: string;
  setUsername: (value: string) => void;
  profileEmail: string;
  setProfileEmail: (value: string) => void;
  profileImage: string;
  rankName: string;
  rankImage?: string | null;
  resetRef: React.MutableRefObject<(() => void) | null>;
  onProfileImageChange: (file: File | null) => void;
  onGoToChangePassword: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onSaveProfile?: () => void;
  onSubmitSongSuggestion?: (data: SuggestionFormData) => void;
  songSuggestions?: SongSuggestion[];

  inventory?: InventorySection;
  equippedCosmetics?: EquippedCosmetics;
  onEquipBanner?: (itemId: number) => void;
  onEquipTitle?: (itemId: number) => void;
  onEquipAvatarBorder?: (itemId: number) => void;
};