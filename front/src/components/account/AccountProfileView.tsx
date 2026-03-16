import React from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  FileButton,
  Grid,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Divider,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  IconChevronRight,
  IconLock,
  IconLogout,
  IconMail,
  IconMusic,
  IconTrash,
  IconTrophy,
  IconUser,
  IconUpload,
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";
import classes from "../../styles/account/AuthenticationTitle.module.css";
import FloatingLabelInput from "../inputs/FloatingLabelInput";

type SuggestionStatus = "pending" | "accepted" | "rejected";

type SongSuggestion = {
  id: number;
  title: string;
  artist: string;
  status: SuggestionStatus;
};

type AccountProfileViewProps = {
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
  onSubmitSongSuggestion?: (data: { title: string; artist: string; message: string }) => void;
  songSuggestions?: SongSuggestion[];
};

function getSuggestionBadge(status: SuggestionStatus) {
  switch (status) {
    case "accepted":
      return {
        color: "green",
        label: "Acceptée",
        icon: <IconCheck size={14} />,
      };
    case "rejected":
      return {
        color: "red",
        label: "Refusée",
        icon: <IconX size={14} />,
      };
    default:
      return {
        color: "yellow",
        label: "En attente",
        icon: <IconClock size={14} />,
      };
  }
}

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
}: AccountProfileViewProps) {
  const [suggestionTitle, setSuggestionTitle] = React.useState("");
  const [suggestionArtist, setSuggestionArtist] = React.useState("");
  const [suggestionMessage, setSuggestionMessage] = React.useState("");

  const handleSubmitSuggestion = () => {
    if (!suggestionTitle.trim() || !suggestionArtist.trim()) return;

    onSubmitSongSuggestion?.({
      title: suggestionTitle.trim(),
      artist: suggestionArtist.trim(),
      message: suggestionMessage.trim(),
    });

    setSuggestionTitle("");
    setSuggestionArtist("");
    setSuggestionMessage("");
  };

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

        <Grid gutter="xl" align="stretch">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              radius="xl"
              p="xl"
              withBorder
              shadow="sm"
              className={classes.sidebar}
            >
              <Stack align="center" gap="lg">
                <div className={classes.avatarSection}>
                  <FileButton
                    resetRef={resetRef}
                    onChange={onProfileImageChange}
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  >
                    {(props) => (
                      <div className={classes.avatarWrapper} {...props}>
                        <Avatar
                          src={profileImage}
                          size={140}
                          radius={140}
                          className={classes.avatar}
                        />
                        <div className={classes.avatarOverlay}>
                          <Stack gap={4} align="center">
                            <IconUpload size={22} />
                            <Text size="xs" fw={600}>
                              Changer la photo
                            </Text>
                          </Stack>
                        </div>
                      </div>
                    )}
                  </FileButton>
                </div>

                <Stack gap={4} align="center">
                  <Title order={2} className={classes.username}>
                    {username || "Pseudo"}
                  </Title>
                  <Text c="dimmed" fs="italic" size="sm">
                    Ton espace perso
                  </Text>
                </Stack>

                <Card
                  radius="xl"
                  padding="lg"
                  withBorder
                  className={classes.rankCard}
                >
                  <Group wrap="nowrap" align="center">
                    <ThemeIcon
                      size={52}
                      radius="xl"
                      variant="light"
                      color="yellow"
                    >
                      <IconMusic size={28} />
                    </ThemeIcon>

                    <div>
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                        Rang actuel
                      </Text>
                      <Text fw={700} size="lg">
                        RANG_NOM
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Stack w="100%" gap="sm">
                  <Button
                    fullWidth
                    radius="xl"
                    size="md"
                    leftSection={<IconUser size={18} />}
                    variant="filled"
                  >
                    Modifier le profil
                  </Button>

                  <Button
                    fullWidth
                    radius="xl"
                    size="md"
                    variant="light"
                    color="red"
                    leftSection={<IconLogout size={18} />}
                    onClick={onLogout}
                  >
                    Se déconnecter
                  </Button>

                  <Button
                    mt="xl"
                    fullWidth
                    radius="xl"
                    size="md"
                    variant="outline"
                    color="red"
                    leftSection={<IconTrash size={18} />}
                    onClick={onDeleteAccount}
                  >
                    Supprimer définitivement le compte
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper
              radius="xl"
              p="lg"
              withBorder
              shadow="sm"
              className={classes.content}
            >
              <Tabs defaultValue="infos" variant="pills" radius="xl">
                <Tabs.List className={classes.tabsList}>
                  <Tabs.Tab value="infos">Informations</Tabs.Tab>
                  <Tabs.Tab value="securite">Sécurité</Tabs.Tab>
                  <Tabs.Tab value="stats">Statistiques</Tabs.Tab>
                  <Tabs.Tab value="propositions">Propositions</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="infos" pt="xl">
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
                </Tabs.Panel>

                <Tabs.Panel value="securite" pt="xl">
                  <Stack gap="md">
                    <div>
                      <Title order={3}>Sécurité</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Gère les options liées à ton compte.
                      </Text>
                    </div>

                    <Paper
                      radius="lg"
                      p="md"
                      withBorder
                      className={classes.innerCard}
                    >
                      <Group justify="space-between" align="center">
                        <Group>
                          <ThemeIcon variant="light" color="red" radius="xl">
                            <IconLock size={18} />
                          </ThemeIcon>
                          <div>
                            <Text fw={600}>Mot de passe</Text>
                            <Text size="sm" c="dimmed">
                              Change ou réinitialise ton mot de passe
                            </Text>
                          </div>
                        </Group>

                        <Button
                          variant="subtle"
                          rightSection={<IconChevronRight size={16} />}
                          onClick={onGoToChangePassword}
                        >
                          Réinitialiser
                        </Button>
                      </Group>
                    </Paper>

                    <Paper
                      radius="lg"
                      p="md"
                      withBorder
                      className={classes.dangerZone}
                    >
                      <Stack gap="xs">
                        <Text fw={700} c="red">
                          Suppression du compte
                        </Text>
                        <Text size="sm" c="dimmed">
                          La suppression du compte est irréversible. Une fois lancé,
                          retour arrière impossible, donc évite le bouton si t’es en mode
                          clic instinctif du démon.
                        </Text>

                        <Group justify="flex-end" mt="sm">
                          <Button
                            radius="xl"
                            color="red"
                            variant="outline"
                            leftSection={<IconTrash size={16} />}
                            onClick={onDeleteAccount}
                          >
                            Supprimer définitivement mon compte
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="stats" pt="xl">
                  <Stack gap="md">
                    <div>
                      <Title order={3}>Statistiques</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Un aperçu rapide de ton activité.
                      </Text>
                    </div>

                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                      <Paper
                        withBorder
                        radius="lg"
                        p="md"
                        className={classes.statCard}
                      >
                        <Group justify="space-between">
                          <Text c="dimmed" size="sm">
                            Parties jouées
                          </Text>
                          <ThemeIcon variant="light" radius="xl">
                            <IconMusic size={16} />
                          </ThemeIcon>
                        </Group>
                        <Title order={3} mt="sm">
                          128
                        </Title>
                      </Paper>

                      <Paper
                        withBorder
                        radius="lg"
                        p="md"
                        className={classes.statCard}
                      >
                        <Group justify="space-between">
                          <Text c="dimmed" size="sm">
                            Meilleur rang
                          </Text>
                          <ThemeIcon variant="light" color="yellow" radius="xl">
                            <IconTrophy size={16} />
                          </ThemeIcon>
                        </Group>
                        <Title order={3} mt="sm">
                          Top 12
                        </Title>
                      </Paper>

                      <Paper
                        withBorder
                        radius="lg"
                        p="md"
                        className={classes.statCard}
                      >
                        <Group justify="space-between">
                          <Text c="dimmed" size="sm">
                            Email vérifié
                          </Text>
                          <ThemeIcon variant="light" color="blue" radius="xl">
                            <IconMail size={16} />
                          </ThemeIcon>
                        </Group>
                        <Badge mt="sm" color="green" variant="light" size="lg">
                          Oui
                        </Badge>
                      </Paper>
                    </SimpleGrid>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="propositions" pt="xl">
                  <Stack gap="lg">
                    <div>
                      <Title order={3}>Proposer une chanson</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Envoie un titre, l’artiste, et éventuellement un petit message.
                      </Text>
                    </div>

                    <Paper
                      withBorder
                      radius="lg"
                      p="lg"
                      className={classes.innerCard}
                    >
                      <Stack gap="md">
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                          <TextInput
                            label="Titre de la musique"
                            placeholder="Ex. Someone Like You"
                            value={suggestionTitle}
                            onChange={(event) =>
                              setSuggestionTitle(event.currentTarget.value)
                            }
                            radius="md"
                          />

                          <TextInput
                            label="Artiste"
                            placeholder="Ex. Adele"
                            value={suggestionArtist}
                            onChange={(event) =>
                              setSuggestionArtist(event.currentTarget.value)
                            }
                            radius="md"
                          />
                        </SimpleGrid>

                        <Textarea
                          label="Pourquoi cette proposition ?"
                          placeholder="Petit message optionnel..."
                          minRows={3}
                          value={suggestionMessage}
                          onChange={(event) =>
                            setSuggestionMessage(event.currentTarget.value)
                          }
                          radius="md"
                        />

                        <Group justify="flex-end">
                          <Button radius="xl" onClick={handleSubmitSuggestion}>
                            Envoyer la proposition
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>

                    <div>
                      <Title order={4}>Liste des propositions</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Tu peux afficher ici les demandes envoyées et leur statut.
                      </Text>
                    </div>

                    <Paper
                      withBorder
                      radius="lg"
                      p="md"
                      className={classes.propositionsList}
                    >
                      <ScrollArea h={320} offsetScrollbars>
                        <Stack gap="sm">
                          {songSuggestions.length === 0 ? (
                            <Paper
                              withBorder
                              radius="md"
                              p="lg"
                              className={classes.emptyState}
                            >
                              <Text ta="center" c="dimmed">
                                Aucune proposition pour le moment.
                              </Text>
                            </Paper>
                          ) : (
                            songSuggestions.map((suggestion, index) => {
                              const badge = getSuggestionBadge(suggestion.status);

                              return (
                                <React.Fragment key={suggestion.id}>
                                  <Group justify="space-between" align="flex-start">
                                    <div>
                                      <Text fw={600}>{suggestion.title}</Text>
                                      <Text size="sm" c="dimmed">
                                        {suggestion.artist}
                                      </Text>
                                    </div>

                                    <Badge
                                      color={badge.color}
                                      variant="light"
                                      leftSection={badge.icon}
                                      radius="sm"
                                    >
                                      {badge.label}
                                    </Badge>
                                  </Group>

                                  {index < songSuggestions.length - 1 && <Divider />}
                                </React.Fragment>
                              );
                            })
                          )}
                        </Stack>
                      </ScrollArea>
                    </Paper>
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}