import {
  Anchor,
  Box,
  Burger,
  Container,
  Group,
  HoverCard,
  Text,
  Image,
  Center,
  SimpleGrid,
  ThemeIcon,
  UnstyledButton,
  Drawer,
  ScrollArea,
  Divider,
  Collapse,
  Avatar,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import { IconDeviceGamepad3, IconChevronDown } from "@tabler/icons-react";
import { API_URL } from "../../config";

// @ts-ignore
import classes from "../../styles/header/Header.module.css";

import logo from "../../res/Blind-Blind-logo-blanc.png";
import defaultProfile from "../../res/default_profil.svg";

const miniJeux = [
  {
    label: "Classic",
    description: "Jouez au mode classique de Blind-Blind",
    icon: IconDeviceGamepad3,
    to: "/classic",
  },
  {
    label: "Artistes",
    description: "Jouez au mode artistes de Blind-Blind",
    icon: IconDeviceGamepad3,
    to: "/artists",
  },
];

type JwtPayload = {
  Id_User?: string;
  nameid?: string;
  Name?: string;
  name?: string;
  username?: string;
  unique_name?: string;
  Avatar?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
};

function getStoredAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(
          (char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`
        )
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getUsernameFromToken(): string {
  const token = getStoredAccessToken();
  if (!token) return "";

  const payload = parseJwt(token);
  if (!payload) return "";

  return payload.Name || payload.name || payload.username || payload.unique_name || "";
}

function getUserIdFromToken(): string {
  const token = getStoredAccessToken();
  if (!token) return "";

  const payload = parseJwt(token);
  if (!payload) return "";

  return (
    payload.Id_User ||
    payload.nameid ||
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ||
    ""
  );
}

async function fetchAvatarFromApi(
  userId: string,
  token: string
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/users/getById/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return defaultProfile;
    }

    const data = await response.json();

    if (data.avatar) {
      return `data:image/png;base64,${data.avatar}`;
    }

    return defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

  const location = useLocation();

  const [username, setUsername] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(defaultProfile);

  useEffect(() => {
    const updateUser = async () => {
      const name = getUsernameFromToken();
      setUsername(name);

      const token = getStoredAccessToken();
      const userId = getUserIdFromToken();

      if (token && userId) {
        const avatar = await fetchAvatarFromApi(userId, token);
        setAvatarSrc(avatar);
      } else {
        setAvatarSrc(defaultProfile);
      }
    };

    updateUser();

    window.addEventListener("storage", updateUser);
    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  const isLoggedIn = !!username;

  return (
    <header className={classes.header}>
      <Container className={classes.inner} size="xl">
        <Box component={Link} to="/" className={classes.logoGroup}>
          <Image src={logo} alt="Blind-Blind" h={32} />
          <span className={classes.siteName}>Blind-Blind</span>
        </Box>

        <Box className={classes.links} visibleFrom="sm">
          <Group gap={20}>
            <Anchor
              component={Link}
              to="/"
              className={classes.link}
              data-active={location.pathname === "/" || undefined}
            >
              Accueil
            </Anchor>

            <HoverCard width={300} position="bottom" radius="md" shadow="md">
              <HoverCard.Target>
                <Box className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Mini-jeux
                    </Box>
                    <IconChevronDown size={16} />
                  </Center>
                </Box>
              </HoverCard.Target>

              <HoverCard.Dropdown>
                <SimpleGrid cols={1} spacing="sm">
                  {miniJeux.map((game) => (
                    <UnstyledButton
                      component={Link}
                      to={game.to}
                      key={game.label}
                      className={classes.subLink}
                    >
                      <Group wrap="nowrap" align="flex-start">
                        <ThemeIcon size={34} variant="default" radius="md">
                          <game.icon size={20} />
                        </ThemeIcon>

                        <div>
                          <Text size="sm" fw={500}>
                            {game.label}
                          </Text>

                          <Text size="xs" c="dimmed">
                            {game.description}
                          </Text>
                        </div>
                      </Group>
                    </UnstyledButton>
                  ))}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
        </Box>

        <Box
          component={Link}
          to="/account"
          aria-label="Ouvrir mon compte"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Text
            size="sm"
            fw={500}
            c="white"
            style={{
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isLoggedIn ? username : "Connectez vous !"}
          </Text>

          <Avatar
            src={avatarSrc}
            alt="Compte"
            size={34}
            radius="xl"
            style={{ cursor: "pointer" }}
          />
        </Box>

        <Burger
          opened={drawerOpened}
          onClick={toggleDrawer}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
          color="white"
        />

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Menu"
          hiddenFrom="sm"
        >
          <ScrollArea h="calc(100vh - 80px)" mx="-md">
            <Divider my="sm" />

            <Anchor
              component={Link}
              to="/"
              className={classes.link}
              onClick={closeDrawer}
            >
              Accueil
            </Anchor>

            <UnstyledButton
              className={classes.link}
              onClick={toggleLinks}
              style={{ display: "block", width: "100%" }}
            >
              <Center inline>
                <Box component="span" mr={5}>
                  Mini-jeux
                </Box>
                <IconChevronDown size={16} />
              </Center>
            </UnstyledButton>

            <Collapse in={linksOpened}>
              <SimpleGrid cols={1} spacing={0}>
                {miniJeux.map((game) => (
                  <UnstyledButton
                    component={Link}
                    to={game.to}
                    key={game.label}
                    className={classes.subLink}
                    onClick={closeDrawer}
                  >
                    <Group wrap="nowrap" align="flex-start">
                      <ThemeIcon size={34} variant="default" radius="md">
                        <game.icon size={20} />
                      </ThemeIcon>

                      <div>
                        <Text size="sm" fw={500}>
                          {game.label}
                        </Text>

                        <Text size="xs" c="dimmed">
                          {game.description}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>
                ))}
              </SimpleGrid>
            </Collapse>

            <Divider my="sm" />

            <UnstyledButton
              component={Link}
              to="/account"
              onClick={closeDrawer}
              className={classes.link}
            >
              <Group>
                <Avatar src={avatarSrc} size={28} radius="xl" />
                <Text>{isLoggedIn ? username : "Mon compte"}</Text>
              </Group>
            </UnstyledButton>
          </ScrollArea>
        </Drawer>
      </Container>
    </header>
  );
}