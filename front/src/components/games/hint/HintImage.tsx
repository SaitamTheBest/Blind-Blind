import { Image } from "@mantine/core";
import HintPopup from "./HintPopup";

export default function HintImage({
  isOpen,
  imageUrl,
  onClose,
}: any) {
  return (
    <HintPopup
      isOpen={isOpen}
      onClose={onClose}
      title="💡 Indice visuel"
    >
      <Image
        src={imageUrl}
        radius="md"
      />
    </HintPopup>
  );
}