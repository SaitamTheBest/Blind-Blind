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
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { IconDeviceGamepad3, IconChevronDown } from '@tabler/icons-react';

// @ts-ignore
import classes from '../../styles/header/Header.module.css';

import logo from '../../res/Blind-Blind-logo-blanc.png';
import defaultProfile from '../../res/default_profil.svg';

const miniJeux = [
  {
    label: 'Classic',
    description: 'Jouez au mode classique de Blind-Blind',
    icon: IconDeviceGamepad3,
    to: '/classic',
  },
  {
    label: 'Artistes',
    description: 'Jouez au mode artistes de Blind-Blind',
    icon: IconDeviceGamepad3,
    to: '/artists',
  },
];

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

  const location = useLocation();

  return (
    <header className={classes.header}>
      <Container className={classes.inner} size="xl">
        {/* LOGO */}
        <Box component={Link} to="/" className={classes.logoGroup}>
          <Image src={logo} alt="Blind-Blind" h={32} />
          <span className={classes.siteName}>Blind-Blind</span>
        </Box>

        {/* DESKTOP LINKS */}
        <Box className={classes.links} visibleFrom="sm">
          <Group gap={20}>
            <Anchor
              component={Link}
              to="/"
              className={classes.link}
              data-active={location.pathname === '/' || undefined}
            >
              Accueil
            </Anchor>

            {/* MINI JEUX */}
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

        {/* AVATAR COMPTE */}
        <Box
          component={Link}
          to="/account"
          aria-label="Ouvrir mon compte"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Avatar
            src={defaultProfile}
            alt="Compte"
            size={34}
            radius="xl"
            style={{ cursor: 'pointer' }}
          />
        </Box>

        {/* BURGER */}
        <Burger
          opened={drawerOpened}
          onClick={toggleDrawer}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
          color="white"
        />

        {/* DRAWER MOBILE */}
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
              style={{ display: 'block', width: '100%' }}
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

            {/* LIEN COMPTE MOBILE */}
            <UnstyledButton
              component={Link}
              to="/account"
              onClick={closeDrawer}
              className={classes.link}
            >
              <Group>
                <Avatar src={defaultProfile} size={28} radius="xl" />
                <Text>Mon compte</Text>
              </Group>
            </UnstyledButton>
          </ScrollArea>
        </Drawer>
      </Container>
    </header>
  );
}