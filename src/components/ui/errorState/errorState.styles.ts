import { StyleSheet } from "react-native";

export const BASE_COLOR = "#20304E";

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

export default styles;
