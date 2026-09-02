import React from "react";

export type EmptyStateVariant = "no-data" | "no-search-results" | "custom";

export type EmptyStateProps = {
  title?: string;
  description?: string;
  variant?: EmptyStateVariant;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
  showAction?: boolean;
};
