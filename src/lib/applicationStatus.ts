import type { BadgeTone } from "@/components/ui/Badge";

export const applicationStatusTones: Record<string, BadgeTone> = {
  qualified: "info",
  rejected: "danger",
  approved: "success",
  scheduled: "warning",
  completed: "strong",
  no_show: "danger",
  withdrawn: "neutral",
};

export const incentiveStatusTones: Record<string, BadgeTone> = {
  pending: "neutral",
  sent: "warning",
  received: "success",
  not_received: "danger",
};
