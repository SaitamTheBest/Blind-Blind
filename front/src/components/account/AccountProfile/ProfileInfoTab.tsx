import { Button, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import FloatingLabelInput from "../../inputs/FloatingLabelInput";

type ProfileInfoTabProps = {
  username: string;
  setUsername: (value: string) => void;
  profileEmail: string;
  setProfileEmail: (value: string) => void;
  onSaveProfile?: () => void;
};

export default function ProfileInfoTab({
  username,
  setUsername,
  profileEmail,
  setProfileEmail,
  onSaveProfile,
}: ProfileInfoTabProps) {
  return (
    <Stack gap="lg">
      <div>
        <Title order={3}>Informations personnelles</Title>
        <Text c="dimmed" size="sm" mt={4}>
          Mets à jour ton pseudo et ton adresse email.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <FloatingLabelInput
          label="Pseudo"
          placeholder="Votre pseudo"
          value={username}
          onChange={setUsername}
          required
        />

        <FloatingLabelInput
          label="Email"
          placeholder="exemple@email.com"
          value={profileEmail}
          onChange={setProfileEmail}
          required
        />
      </SimpleGrid>

      <Group justify="flex-end">
        <Button radius="xl" size="md" onClick={onSaveProfile}>
          Enregistrer les modifications
        </Button>
      </Group>
    </Stack>
  );
}