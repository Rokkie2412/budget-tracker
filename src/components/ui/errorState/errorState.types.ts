export type ErrorVariant = "default" | "network" | "server" | "notFound" | "empty";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  errorCode?: string | number;
  onRetry?: () => void;
  onSecondaryAction?: () => void;
  retryText?: string;
  secondaryText?: string;
  icon?: React.ReactNode;
  variant?: ErrorVariant;
  className?: string;
  showIconBadge?: boolean;
};
