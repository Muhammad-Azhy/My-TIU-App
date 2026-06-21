import React, { useRef } from "react";
import { Animated, Pressable } from "react-native";

/**
 * A Pressable that subtly scales down on press (0.97) and springs back.
 * Use in place of TouchableOpacity / Pressable for interactive cards.
 *
 *   <PressableScale onPress={handleTap} style={styles.card}>
 *     <Text>Tap me</Text>
 *   </PressableScale>
 */
export default function PressableScale({
  children,
  onPress,
  style,
  disabled,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
