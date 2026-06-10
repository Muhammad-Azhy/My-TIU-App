import { Platform } from "react-native";

export const stackFadeOptions = {
  headerShown: false,
  animation: Platform.select({
    ios: "fade_from_bottom",
    android: "fade_from_bottom",
    default: "fade",
  }),
  animationDuration: 260,
};

export const stackSlideOptions = {
  headerShown: false,
  animation: "slide_from_right",
  animationDuration: 280,
};
