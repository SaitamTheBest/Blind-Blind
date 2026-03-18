import { Paper, Tabs } from "@mantine/core";
import classes from "../../../styles/account/AuthenticationTitle.module.css";
import ProfileInfoTab from "./ProfileInfoTab";
import ProfileSecurityTab from "./ProfileSecurityTab";
import ProfileStatsTab from "./ProfileStatsTab";
import ProfileSuggestionsTab from "./ProfileSuggestionsTab";
import { SongSuggestion, SuggestionFormData } from "./types";

type ProfileTabsProps = {
  username: string;
  setUsername: (value: string) => void;
  profileEmail: string;
  setProfileEmail: (value: string) => void;
  onGoToChangePassword: () => void;
  onDeleteAccount: () => void;
  onSaveProfile?: () => void;
  onSubmitSongSuggestion?: (data: SuggestionFormData) => void;
  songSuggestions: SongSuggestion[];
};

export default function ProfileTabs({
  username,
  setUsername,
  profileEmail,
  setProfileEmail,
  onGoToChangePassword,
  onDeleteAccount,
  onSaveProfile,
  onSubmitSongSuggestion,
  songSuggestions,
}: ProfileTabsProps) {
  return (
    <Paper radius="xl" p="lg" withBorder shadow="sm" className={classes.content}>
      <Tabs defaultValue="infos" variant="pills" radius="xl">
        <Tabs.List className={classes.tabsList}>
          <Tabs.Tab value="infos">Informations</Tabs.Tab>
          <Tabs.Tab value="securite">Sécurité</Tabs.Tab>
          <Tabs.Tab value="stats">Statistiques</Tabs.Tab>
          <Tabs.Tab value="propositions">Propositions</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="infos" pt="xl">
          <ProfileInfoTab
            username={username}
            setUsername={setUsername}
            profileEmail={profileEmail}
            setProfileEmail={setProfileEmail}
            onSaveProfile={onSaveProfile}
          />
        </Tabs.Panel>

        <Tabs.Panel value="securite" pt="xl">
          <ProfileSecurityTab
            onGoToChangePassword={onGoToChangePassword}
            onDeleteAccount={onDeleteAccount}
          />
        </Tabs.Panel>

        <Tabs.Panel value="stats" pt="xl">
          <ProfileStatsTab />
        </Tabs.Panel>

        <Tabs.Panel value="propositions" pt="xl">
          <ProfileSuggestionsTab
            onSubmitSongSuggestion={onSubmitSongSuggestion}
            songSuggestions={songSuggestions}
          />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}