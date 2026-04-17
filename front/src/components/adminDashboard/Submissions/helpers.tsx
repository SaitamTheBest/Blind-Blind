import { Badge } from "@mantine/core";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import type { SuggestionStatus } from "./types";

type StatusBadge = {
  color: string;
  label: string;
  icon: React.ReactNode;
};

export function getStatusBadge(status: SuggestionStatus): StatusBadge {
  switch (status) {
    case "accepted":
      return {
        color: "green",
        label: "Acceptée",
        icon: <IconCheck size={14} />,
      };

    case "rejected":
      return {
        color: "red",
        label: "Refusée",
        icon: <IconX size={14} />,
      };

    default:
      return {
        color: "yellow",
        label: "En attente",
        icon: <IconClock size={14} />,
      };
  }
}

export function renderStatusBadge(status: SuggestionStatus) {
  const badge = getStatusBadge(status);

  return (
    <Badge
      color={badge.color}
      variant="light"
      leftSection={badge.icon}
      radius="sm"
    >
      {badge.label}
    </Badge>
  );
}