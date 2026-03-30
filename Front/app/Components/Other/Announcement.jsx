import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { mS, rS, vS } from "../../Styles/responsive";
import Logo from "../../../assets/placeholder.jpg";
import ImageViewer from "react-native-image-zoom-viewer";

const Announcment = ({ id, title, images, desc, date, theme }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const desc2 = desc.split(".")[0] + ".";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.AnnouncmentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.AnnouncmentTitle, { color: theme.text }]}>{title}</Text>
        {images && images.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSelectedImageIndex(0);
              setModalVisible(true);
            }}
            style={styles.imageWrapper}
          >
            <Image source={images[0] || Logo} style={styles.image} />
            {images.length > 1 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>+{images.length - 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        <Text style={[styles.AnnouncmentDescription, { color: theme.subText }]}>
          {expanded ? desc : desc2}
        </Text>

        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={[styles.moreBtn, { color: theme.primary }]}>
            {expanded ? "Show Less" : "More Details"}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.AnnouncmentDate, { color: theme.subText }]}>{date}</Text>
      </View>
      {images && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <ImageViewer
              imageUrls={images.map((img) => ({
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

              <TouchableOpacity onPress={{}} style={styles.iconButton}>
                <Icon name="file-download" size={mS(28)} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

export default React.memo(Announcment);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: vS(200),
    borderRadius: rS(10),
    marginVertical: vS(8),
    resizeMode: "cover",
  },
  AnnouncmentCard: {
    backgroundColor: "#f8f8f8",
    padding: mS(15),
    marginBottom: vS(25),
    borderRadius: rS(10),
    borderColor: "#ddd",
    borderWidth: rS(1),
  },
  badge: {
    position: "absolute",
    top: vS(10),
    right: rS(10),
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: rS(8),
    paddingVertical: vS(4),
    borderRadius: rS(12),
  },
  badgeText: {
    color: "#fff",
    fontSize: mS(12),
    fontWeight: "bold",
  },
  AnnouncmentTitle: {
    fontSize: mS(16),
    fontWeight: "bold",
  },
  AnnouncmentDescription: {
    fontSize: mS(14),
    color: "#555",
    marginTop: vS(6),
    lineHeight: vS(20),
  },
  moreBtn: {
    fontSize: mS(13),
    color: "#007BFF",
    marginTop: vS(4),
    fontWeight: "500",
  },
  AnnouncmentDate: {
    fontSize: mS(12),
    textAlign: "right",
    margin: mS(4),
    fontWeight: "bold",
    color: "#333",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#000",
    borderTopColor: "#343434ff",
    borderTopWidth: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: mS(15),
    backgroundColor: "#111",
  },
  iconButton: {
    padding: mS(10),
    backgroundColor: "#000000ff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingVertical: vS(10),
    paddingHorizontal: rS(20),
    backgroundColor: "#007BFF",
    borderRadius: rS(8),
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: mS(14),
  },
});