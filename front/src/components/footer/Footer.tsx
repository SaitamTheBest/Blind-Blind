import {
    IconBrandInstagram,
    IconBrandTwitter,
    IconBrandDiscord,
} from '@tabler/icons-react';
import { ActionIcon, Container, Group, Text } from '@mantine/core';
// @ts-ignore
import classes from '../../styles/footer/Footer.module.css';

export default function Footer() {
    return (
        <footer className={classes.footer}>
            <Container className={classes.inner} size="xl">
                <Text size="sm" c="dimmed">
                    blindblind.fr — 2025
                </Text>
                <Group gap="xs" className={classes.links} justify="flex-end" wrap="wrap">
                    <ActionIcon
                        component="a"
                        href="https://x.com/BlindBlind_Off"
                        size="lg"
                        color="gray"
                        variant="subtle"
                        aria-label="Twitter"
                    >
                        <IconBrandTwitter size={20} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon
                        component="a"
                        href="https://www.instagram.com/blindblind_off?igsh=MXQwMGF6aXEzMmEz"
                        size="lg"
                        color="gray"
                        variant="subtle"
                        aria-label="Instagram"
                    >
                        <IconBrandInstagram size={20} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon
                        component="a"
                        href="https://discord.gg/bMFeHyfKut"
                        size="lg"
                        color="gray"
                        variant="subtle"
                        aria-label="Discord"
                    >
                        <IconBrandDiscord size={20} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Container>
        </footer>
    );
}
