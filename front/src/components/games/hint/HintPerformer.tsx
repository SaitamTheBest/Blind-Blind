import { Text } from "@mantine/core";
import HintPopup from "./HintPopup";

export default function HintPerformer({
  isOpen,
  performer_type,
  onClose,
}: any) {

  const getHintText = (
    type?: string
  ): string => {
    if (!type)
      return "Type d'interprète inconnu.";

    switch (
      type.toLowerCase()
    ) {
      case "homme":
        return "L'artiste qui chante cette musique est un homme 🎶";

      case "femme":
        return "L'artiste qui chante cette musique est une femme 🎶";

      case "groupe":
        return "Cette chanson est interprétée par un groupe 🎶";

      case "featuring":
        return "Les artistes de cette chanson sont en featuring 🎶";

      default:
        return "Type d'interprète inconnu.";
    }
  };

  return (
    <HintPopup
      isOpen={isOpen}
      onClose={onClose}
      title="💡 Indice Artiste(s)"
    >
      <Text ta="center" size="lg">
        {getHintText(
          performer_type
        )}
      </Text>
    </HintPopup>
  );
}