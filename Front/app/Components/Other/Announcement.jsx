import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { mS, rS, vS } from "../../Styles/responsive";
import ImageViewer from "react-native-image-zoom-viewer";
import PressableScale from "../animations/PressableScale";
import NewsThumbnail from "../news/NewsThumbnail";
import { getNewsImageSources } from "../../utils/newsImages";

const Announcment = ({ id, title, images, desc, date, theme }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const resolvedImages =
    images && images.length > 0 ? images : getNewsImageSources(id);
  const preview = (desc || "").trim();
  const shortPreview =
    preview.length > 120 && !expanded
      ? `${preview.slice(0, 120).trim()}…`
      : preview;

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.AnnouncmentCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <PressableScale
          onPress={() => {
            setSelectedImageIndex(0);
            setModalVisible(true);
          }}
        >
          <NewsThumbnail id={id} style={styles.thumb} />
        </PressableScale>

        <Text style={[styles.AnnouncmentTitle, { color: theme.text }]}>
          {title}
        </Text>

        {shortPreview ? (
          <Text style={[styles.AnnouncmentDescription, { color: theme.subText }]}>
            {expanded ? preview : shortPreview}
          </Text>
        ) : null}

        {preview.length > 120 ? (
          <PressableScale onPress={() => setExpanded((v) => !v)}>
            <Text style={[styles.moreBtn, { color: theme.primary }]}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </PressableScale>
        ) : null}

        <Text style={[styles.AnnouncmentDate, { color: theme.subText }]}>
          {date}
        </Text>
      </View>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <ImageViewer
            imageUrls={resolvedImages.map((img) => ({
              url: "",
              props: { source: img },
            }))}
            index={selectedImageIndex}
            enableSwipeDown
            onSwipeDown={() => setModalVisible(false)}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={mS(28)} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

    </View>
  );
};

export default React.memo(Announcment);

const styles = StyleSheet.create({
  outer: {
    marginBottom: vS(4),
  },
  thumb: {
    marginBottom: vS(10),
  },
  AnnouncmentCard: {
    padding: mS(16),
    marginBottom: vS(12),
    borderRadius: rS(14),
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  AnnouncmentTitle: {
    fontSize: mS(17),
    fontWeight: "700",
    marginBottom: vS(6),
  },
  AnnouncmentDescription: {
    fontSize: mS(14),
    lineHeight: mS(21),
  },
  moreBtn: {
    fontSize: mS(13),
    marginTop: vS(8),
    fontWeight: "600",
  },
  AnnouncmentDate: {
    fontSize: mS(12),
    textAlign: "right",
    marginTop: vS(10),
    fontWeight: "600",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: mS(15),
    backgroundColor: "#111",
  },
  iconButton: {
    padding: mS(10),
    borderRadius: 8,
  },
});
