import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { rS } from "../../Styles/responsive";
import { getNewsThumbnail } from "../../utils/newsImages";

export default function NewsThumbnail({ id, style, imageStyle }) {
  const { source, overlay } = getNewsThumbnail(id);

  return (
    <View style={[styles.wrap, style]}>
      <Image source={source} style={[styles.image, imageStyle]} resizeMode="cover" />
      <View style={[styles.overlay, { backgroundColor: overlay }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: rS(12),
    overflow: "hidden",
    backgroundColor: "#e8e8e8",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
