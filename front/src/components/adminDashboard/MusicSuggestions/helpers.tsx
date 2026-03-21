import { Badge } from "@mantine/core";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import type { SuggestionStatus } from "./types";

export function getStatusBadge(status: SuggestionStatus) {
  switch (status) {
    case "accepted":
      return (
        <Badge color="green" variant="light" leftSection={<IconCheck size={14} />}>
          Acceptée
        </Badge>
      );
    case "rejected":
      return (
        <Badge color="red" variant="light" leftSection={<IconX size={14} />}>
          Refusée
        </Badge>
      );
    default:
      return (
        <Badge color="yellow" variant="light" leftSection={<IconClock size={14} />}>
          En attente
        </Badge>
      );
  }
}