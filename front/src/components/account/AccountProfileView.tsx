import { Container, Grid, Stack, Text, Title } from "@mantine/core";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import ProfileSidebar from "./AccountProfile/ProfileSidebar";
import ProfileTabs from "./AccountProfile/ProfileTabs";
import { AccountProfileViewProps } from "./AccountProfile/types";

export default function AccountProfileView({
  username,
  setUsername,
  profileEmail,
  setProfileEmail,
  profileImage,
  resetRef,
  onProfileImageChange,
  onGoToChangePassword,
  onLogout,
  onDeleteAccount,
  onSaveProfile,
  onSubmitSongSuggestion,
  songSuggestions = [
    { id: 1, title: "Numb", artist: "Linkin Park", status: "accepted" },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", status: "pending" },
    { id: 3, title: "Believer", artist: "Imagine Dragons", status: "rejected" },
  ],
  inventory = {
    banners: [
      { id: 1, name: "Océan pastel", rarity: "rare", equipped: true },
      { id: 2, name: "Nuit néon", rarity: "epic" },
    ],
    titles: [
      { id: 10, name: "Roi du blind test", rarity: "legendary", equipped: true },
      { id: 11, name: "Chasseur de refrains", rarity: "rare" },
    ],
    avatarBorders: [
      { id: 20, name: "Halo argenté", rarity: "common", equipped: true },
      { id: 21, name: "Pulse violet", rarity: "epic" },
    ],
  },
  equippedCosmetics = {
    banner: { id: 1, name: "Océan pastel", equipped: true },
    title: { id: 10, name: "Roi du blind test", equipped: true },
    avatarBorder: { id: 20, name: "Halo argenté", equipped: true },
  },
  onEquipBanner,
  onEquipTitle,
  onEquipAvatarBorder,
}: AccountProfileViewProps) {
  return (
    <div className={classes.page}>
      <Container size="xl" py="xl">
        <Stack gap="xs" mb="xl">
          <Title order={1} className={classes.pageTitle}>
            Mon profil
          </Title>
          <Text c="dimmed" size="sm">
            Gère ton profil, la sécurité du compte et tes propositions de chansons.
          </Text>
        </Stack>

        <Grid gutter="xl" align="start">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <ProfileSidebar
              username={username}
              profileImage={profileImage}
              resetRef={resetRef}
              onProfileImageChange={onProfileImageChange}
              onLogout={onLogout}
              equippedCosmetics={equippedCosmetics}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <ProfileTabs
              username={username}
              setUsername={setUsername}
              profileEmail={profileEmail}
              setProfileEmail={setProfileEmail}
              onGoToChangePassword={onGoToChangePassword}
              onDeleteAccount={onDeleteAccount}
              onSaveProfile={onSaveProfile}
              onSubmitSongSuggestion={onSubmitSongSuggestion}
              songSuggestions={songSuggestions}
              inventory={inventory}
              equippedCosmetics={equippedCosmetics}
              onEquipBanner={onEquipBanner}
              onEquipTitle={onEquipTitle}
              onEquipAvatarBorder={onEquipAvatarBorder}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}