import { Avatar, Badge, Box, Group, Stack, Text } from "@mantine/core";
import classes from "../../../styles/account/AuthenticationTitle.module.css";
import { EquippedCosmetics } from "./types";

type UserCardPreviewProps = {
  username: string;
  profileImage: string;
  equippedCosmetics?: EquippedCosmetics;
};

export default function UserCardPreview({
  username,
  profileImage,
  equippedCosmetics,
}: UserCardPreviewProps) {
  const bannerLabel = equippedCosmetics?.banner?.name || "Bannière par défaut";
  const titleLabel = equippedCosmetics?.title?.name || "Sans titre";
  const borderLabel = equippedCosmetics?.avatarBorder?.name || "Bordure par défaut";

  return (
    <Box className={classes.userCardBanner}>
      <Group align="center" gap="md" wrap="nowrap">
        <Box className={classes.userCardAvatarRing}>
          <Avatar
            src={profileImage}
            size={72}
            radius="xl"
            className={classes.userCardAvatar}
          />
        </Box>

        <Stack gap={2}>
          <Text fw={800} size="lg" className={classes.userCardName}>
            {username || "Pseudo"}
          </Text>
          <Text size="sm" c="dimmed" className={classes.userCardTitle}>
            {titleLabel}
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}