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
    Collapse
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { IconDeviceGamepad3, IconChevronDown } from '@tabler/icons-react';
// @ts-ignore
import classes from '../../styles/header/Header.module.css';
import logo from '../../res/Blind-Blind-logo-blanc.png';

const miniJeux = [
    {
        label: 'Classic',
        description: 'Jouez au mode classique de Blind-Blind ',
        icon: IconDeviceGamepad3,
        to: '/classic',
    },
];

export default function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const location = useLocation();

    return (
        <header className={classes.header}>
            <Container className={classes.inner} size="xl">
                <Box component={Link} to="/" className={classes.logoGroup}>
                    <Image src={logo} alt="Blind-Blind" h={32} />
                    <span className={classes.siteName}>Blind-Blind</span>
                </Box>

                {/* Desktop links */}
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

                        {/* HoverCard for desktop */}
                        <HoverCard width={300} position="bottom" radius="md" shadow="md" withinPortal>
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
                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
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

                {/* Burger */}
                <Burger opened={drawerOpened}
                        onClick={toggleDrawer}
                        className={classes.burger}
                        size="sm"
                        hiddenFrom="sm"
                        color="white"
                />

                {/* Drawer mobile */}
                <Drawer
                    opened={drawerOpened}
                    onClose={closeDrawer}
                    size="100%"
                    padding="md"
                    title="Menu"
                    hiddenFrom="sm"
                    zIndex={1000000}
                >
                    <ScrollArea h="calc(100vh - 80px)" mx="-md">
                        <Divider my="sm" />

                        <Anchor component={Link} to="/" className={classes.link} onClick={closeDrawer}>
                            Accueil
                        </Anchor>

                        {/* Bouton qui toggle la sous-section Mini jeux */}
                        <UnstyledButton className={classes.link} onClick={toggleLinks}
                                        style={{ display: 'block', width: '100%' }}>
                            <Center inline>
                                <Box component="span" mr={5}>
                                    Mini-jeux
                                </Box>
                                <IconChevronDown size={16} />
                            </Center>
                        </UnstyledButton>

                        {/* Sous-liens de Mini jeux */}
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
                    </ScrollArea>
                </Drawer>
            </Container>
        </header>
    );
}
