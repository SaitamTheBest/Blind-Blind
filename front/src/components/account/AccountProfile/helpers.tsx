import React from "react";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import { SuggestionStatus } from "./types";

export function getSuggestionBadge(status: SuggestionStatus) {
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