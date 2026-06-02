import {
  Modal,
  Stack,
  Text,
  Title,
  Image,
  Button,
} from '@mantine/core';

interface PopupProps {
  isOpen: boolean;
  trackDetails: any | null;
  onClose: () => void;
}

export default function SuccessPopup({
  isOpen,
  trackDetails,
  onClose,
}: PopupProps) {
  if (!trackDetails) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      title="🎉 Félicitations"
      size="lg"
    >
      <Stack>
        <Text>Vous avez trouvé la bonne chanson !</Text>

        <Text>
          Revenez demain pour une nouvelle partie 📀
        </Text>

        <Image
          src={trackDetails.image}
          alt={trackDetails.name}
          radius="md"
        />

        <Title order={3}>
          {trackDetails.name}
        </Title>

        <Text>
          <b>Artistes :</b>{' '}
          {trackDetails.artists?.join(', ')}
        </Text>

        <Text>
          <b>Album :</b> {trackDetails.album}
        </Text>

        <Text>
          <b>Date :</b> {trackDetails.release_year}
        </Text>

        <Button onClick={onClose}>
          Fermer
        </Button>
      </Stack>
    </Modal>
  );
}