import {
  Modal,
  Button,
  Stack
} from "@mantine/core";

interface HintPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function HintPopup({
  isOpen,
  onClose,
  children,
  title,
}: HintPopupProps) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      title={title}
    >
      <Stack>
        {children}

        <Button onClick={onClose}>
          Fermer
        </Button>
      </Stack>
    </Modal>
  );
}