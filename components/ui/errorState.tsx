import { useLanguageStore } from "@/stores/languageStore";
import {
  AlertTriangle,
  ArrowLeft,
  FileQuestion,
  RefreshCw,
  ServerCrash,
  WifiOff,
} from "lucide-react-native";
import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export type ErrorVariant =
  | "default"
  | "network"
  | "server"
  | "notFound"
  | "empty";

export interface ErrorStateProps {
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
}

const BASE_COLOR = "#20304E";

const ErrorIllustration = ({
  variant,
  customIcon,
}: {
  variant: ErrorVariant;
  customIcon?: React.ReactNode;
}): React.JSX.Element => {
  const getIcon = (): React.ReactNode => {
    if (customIcon) return customIcon;
    switch (variant) {
      case "network":
        return <WifiOff size={36} color="#FFFFFF" strokeWidth={2.2} />;
      case "server":
        return <ServerCrash size={36} color="#FFFFFF" strokeWidth={2.2} />;
      case "notFound":
      case "empty":
        return <FileQuestion size={36} color="#FFFFFF" strokeWidth={2.2} />;
      case "default":
      default:
        return <AlertTriangle size={36} color="#FFFFFF" strokeWidth={2.2} />;
    }
  };

  return (
    <View className="relative items-center justify-center w-52 h-52">
      {/* Background Decorative SVG Graphic Elements */}
      <Svg
        height="208"
        width="208"
        viewBox="0 0 208 208"
        style={styles.svgAbsolute}
      >
        {/* Outer subtle aura rings */}
        <Circle
          cx="104"
          cy="104"
          r="92"
          stroke={BASE_COLOR}
          strokeWidth="1.5"
          strokeOpacity="0.08"
          strokeDasharray="4 6"
        />
        <Circle
          cx="104"
          cy="104"
          r="76"
          stroke={BASE_COLOR}
          strokeWidth="1.5"
          strokeOpacity="0.12"
        />
        <Circle cx="104" cy="104" r="58" fill={BASE_COLOR} fillOpacity="0.04" />

        {/* Orbiting geometric micro-elements */}
        <Rect
          x="100"
          y="12"
          width="8"
          height="8"
          rx="2"
          fill={BASE_COLOR}
          fillOpacity="0.3"
          transform="rotate(45 104 16)"
        />
        <Circle cx="188" cy="116" r="3.5" fill="#EF4444" fillOpacity="0.8" />
        <Circle cx="24" cy="92" r="3" fill={BASE_COLOR} fillOpacity="0.35" />
        <Circle cx="164" cy="50" r="2.5" fill={BASE_COLOR} fillOpacity="0.25" />
        <Circle cx="44" cy="154" r="3" fill="#EF4444" fillOpacity="0.5" />

        {/* Small corner decorative crosses */}
        <Path
          d="M 148 160 L 156 160 M 152 156 L 152 164"
          stroke={BASE_COLOR}
          strokeWidth="1.5"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
      </Svg>

      {/* Floating Ambient Glow Base */}
      <View
        style={[
          styles.glowBase,
          {
            backgroundColor: BASE_COLOR,
            opacity: 0.12,
          },
        ]}
      />

      {/* Outer Central Layered Plate */}
      <View
        className="w-24 h-24 rounded-3xl items-center justify-center shadow-lg"
        style={[styles.shieldPlate, { backgroundColor: BASE_COLOR }]}
      >
        {/* Subtle Inner Glass Ring */}
        <View className="w-20 h-20 rounded-2xl items-center justify-center border border-white/20 bg-white/10">
          {getIcon()}
        </View>

        {/* Floating Red Accent Dot at Top-Right */}
        <View className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#EF4444] border-2 border-white items-center justify-center">
          <View className="w-1.5 h-1.5 rounded-full bg-white" />
        </View>
      </View>
    </View>
  );
};

export const ErrorState = ({
  title,
  description,
  errorCode,
  onRetry,
  onSecondaryAction,
  retryText,
  secondaryText,
  icon,
  variant = "default",
  className = "",
  showIconBadge = true,
}: ErrorStateProps): React.JSX.Element => {
  const { t } = useLanguageStore();

  const resolvedTitle = title ?? t("errorTitle");
  const resolvedDescription = description ?? t("errorDescription");
  const resolvedRetryText = retryText ?? t("retry");
  const resolvedSecondaryText = secondaryText ?? t("goBack");

  const handleRetryPress = (event: GestureResponderEvent): void => {
    event.preventDefault();
    if (onRetry) {
      onRetry();
    }
  };

  const handleSecondaryPress = (event: GestureResponderEvent): void => {
    event.preventDefault();
    if (onSecondaryAction) {
      onSecondaryAction();
    }
  };

  return (
    <View
      className={`flex-1 w-full justify-center items-center px-6 py-8 ${className}`}
    >
      {/* Unique Visual Illustration */}
      {showIconBadge && (
        <ErrorIllustration variant={variant} customIcon={icon} />
      )}

      {/* Optional Error Code Badge */}
      {errorCode !== undefined && (
        <View className="flex-row items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full bg-[#20304E]/10 border border-[#20304E]/15">
          <View className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <Text className="text-xs font-semibold tracking-wider text-[#20304E]">
            {typeof errorCode === "number" ? `CODE ${errorCode}` : errorCode}
          </Text>
        </View>
      )}

      {/* Error Title */}
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        className="text-2xl font-bold text-center text-[#20304E] mt-2 mb-2 tracking-tight"
      >
        {resolvedTitle}
      </Text>

      {/* Error Description */}
      <Text className="text-sm font-medium text-center text-slate-500 max-w-70 leading-relaxed mb-6">
        {resolvedDescription}
      </Text>

      {/* Action Buttons */}
      <View className="w-full max-w-70 gap-3">
        {onRetry && (
          <Pressable
            onPress={handleRetryPress}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: BASE_COLOR, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <RefreshCw size={18} color="#FFFFFF" strokeWidth={2.2} />
            <Text className="text-white text-base font-semibold tracking-wide">
              {resolvedRetryText}
            </Text>
          </Pressable>
        )}

        {onSecondaryAction && (
          <Pressable
            onPress={handleSecondaryPress}
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ArrowLeft size={16} color={BASE_COLOR} strokeWidth={2} />
            <Text className="text-[#20304E] text-sm font-semibold tracking-wide">
              {resolvedSecondaryText}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  svgAbsolute: {
    position: "absolute",
  },
  glowBase: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  shieldPlate: {
    shadowColor: BASE_COLOR,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: BASE_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(32, 48, 78, 0.2)",
    backgroundColor: "transparent",
  },
});

export default ErrorState;
