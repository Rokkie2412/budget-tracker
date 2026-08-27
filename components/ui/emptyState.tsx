import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import NoTransactionDataIcon from "assets/noTransactionDataIcon";
import { Plus, SearchX } from "lucide-react-native";

import { useLanguageStore } from "@/stores/languageStore";

export type EmptyStateVariant = "no-data" | "no-search-results" | "custom";

export interface EmptyStateProps {
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
}

const BASE_COLOR = "#20304E";

const SearchEmptyIllustration = (): React.JSX.Element => {
  return (
    <View className="relative items-center justify-center w-44 h-44">
      <Svg
        height="176"
        width="176"
        viewBox="0 0 176 176"
        style={styles.svgAbsolute}
      >
        <Circle cx="88" cy="88" r="54" fill={BASE_COLOR} fillOpacity="0.04" />
        <Rect
          x="84"
          y="10"
          width="8"
          height="8"
          rx="2"
          fill={BASE_COLOR}
          fillOpacity="0.25"
          transform="rotate(45 88 14)"
        />
        <Circle cx="158" cy="98" r="3.5" fill="#3B82F6" fillOpacity="0.6" />
        <Circle cx="20" cy="78" r="3" fill={BASE_COLOR} fillOpacity="0.3" />
        <Circle cx="140" cy="40" r="2.5" fill={BASE_COLOR} fillOpacity="0.2" />
        <Circle cx="38" cy="130" r="3" fill="#3B82F6" fillOpacity="0.4" />
        <Path
          d="M 125 135 L 133 135 M 129 131 L 129 139"
          stroke={BASE_COLOR}
          strokeWidth="1.5"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
      </Svg>

      <View className="w-20 h-20 rounded-full bg-[#EEF3FA] items-center justify-center shadow-sm">
        <SearchX size={38} color="#20304E" strokeWidth={2.2} />
      </View>
    </View>
  );
};

const EmptyIllustration = ({
  variant,
  customIcon,
}: {
  variant: EmptyStateVariant;
  customIcon?: React.ReactNode;
}): React.JSX.Element => {
  if (customIcon) {
    return (
      <View className="items-center justify-center mb-3">{customIcon}</View>
    );
  }

  if (variant === "no-search-results") {
    return <SearchEmptyIllustration />;
  }

  return (
    <View className="items-center justify-center mb-2">
      <NoTransactionDataIcon size={140} />
    </View>
  );
};

export const EmptyState = ({
  title,
  description,
  variant = "no-data",
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = "",
  showAction = true,
}: EmptyStateProps): React.JSX.Element => {
  const { t } = useLanguageStore();

  const defaultTitle = t("noTransaction");

  const defaultDescription = t("noTransactionDescription");

  const defaultActionText = t("noTransactionDataButton");

  const displayTitle = title ?? defaultTitle;
  const displayDescription = description ?? defaultDescription;
  const displayActionText = actionText ?? defaultActionText;

  return (
    <View
      className={`flex flex-col items-center justify-center py-10 px-6 bg-white rounded-2xl ${className}`}
    >
      <EmptyIllustration variant={variant} customIcon={icon} />

      <Text className="text-xl font-bold text-[#20304E] text-center mt-2 mb-2">
        {displayTitle}
      </Text>

      <Text className="text-sm text-slate-500 text-center leading-relaxed max-w-70 mb-6">
        {displayDescription}
      </Text>

      {showAction && (onAction || displayActionText) && (
        <View className="w-full max-w-60 gap-3 items-center">
          {onAction && (
            <Pressable
              onPress={onAction}
              className="w-full flex-row items-center justify-center gap-2 bg-[#1C2A44] active:bg-[#152136] px-5 py-3 rounded-xl shadow-sm"
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text className="text-white text-sm font-semibold tracking-wide text-center">
                {displayActionText}
              </Text>
            </Pressable>
          )}

          {secondaryActionText && onSecondaryAction && (
            <Pressable
              onPress={onSecondaryAction}
              className="w-full py-2.5 items-center justify-center active:opacity-70"
            >
              <Text className="text-[#20304E] text-sm font-medium text-center">
                {secondaryActionText}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  svgAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default EmptyState;
