import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Wraps a single list item / card with a staggered fade-in animation.
 * Pass `index` to stagger the delay across siblings.
 *
 *   <AnimatedCard index={i}>
 *     <MyCard />
 *   </AnimatedCard>
 */
export default function AnimatedCard({
  children,
  index = 0,
  style,
  staggerMs = 60,
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    const delay = index * staggerMs;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
