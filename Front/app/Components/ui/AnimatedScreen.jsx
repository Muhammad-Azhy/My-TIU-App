import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Wraps children in a subtle fade-in + slide-up animation.
 * Drop this at the top level of any screen for a smooth entrance.
 *
 *   <AnimatedScreen>
 *     <Text>Hello</Text>
 *   </AnimatedScreen>
 */
export default function AnimatedScreen({ children, style, delay = 0 }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[{ flex: 1, opacity, transform: [{ translateY }] }, style]}
    >
      {children}
    </Animated.View>
  );
}
