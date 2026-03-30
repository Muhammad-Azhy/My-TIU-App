import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImageViewer from "react-native-image-zoom-viewer";
import { rS, mS, vS } from "../../Styles/responsive";
import useTheme from "../../Hooks/useTheme";

export default function DepartmentDetails({ route }) {
  const { dept } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();

  const deptColor = theme.mode === "dark" ? dept["dark-color"] : dept["light-color"];

  const dummyPhotos = [
    { uri: "https://picsum.photos/400/300?random=101" },
    { uri: "https://picsum.photos/400/300?random=102" },
    { uri: "https://picsum.photos/400/300?random=103" },
    { uri: "https://picsum.photos/400/300?random=104" },
  ];

  const imageUrls = dummyPhotos.map((img) => ({ url: img.uri }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: deptColor }]}>
        <MaterialIcons name={dept.icon} size={mS(50)} color="#fff" />
        <Text style={styles.title}>{dept.name}</Text>
      </View>

      <View style={styles.content}>
        {/* About */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About the Department</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            {dept.description || "No description available yet."}
          </Text>
        </View>

        {/* Tuition */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Tuition & Fees</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            {dept.tuition || "Tuition info coming soon."}
          </Text>
        </View>

        {/* Other Info */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Other Info</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            {dept.otherInfo || "Additional info will be added."}
          </Text>
        </View>

        {/* Photo Gallery */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Photo Gallery</Text>
          <FlatList
            data={dummyPhotos}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImageIndex(index);
                  setModalVisible(true);
                }}
              >
                <Image source={item} style={styles.photo} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Modal for full-screen images */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <ImageViewer
            imageUrls={imageUrls}
            index={selectedImageIndex}
            enableSwipeDown
            onSwipeDown={() => setModalVisible(false)}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" size={mS(30)} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    padding: rS(20),
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    marginTop: rS(10),
    fontSize: rS(22),
    fontWeight: "bold",
    color: "#fff",
  },

  content: {
    padding: rS(15),
  },

  card: {
    backgroundColor: "#fff",
    padding: rS(15),
    borderRadius: rS(12),
    marginBottom: rS(12),
    elevation: 2,
  },

  sectionTitle: {
    fontSize: rS(18),
    fontWeight: "bold",
    marginBottom: rS(6),
  },

  description: {
    fontSize: rS(15),
    color: "#333",
  },

  photo: {
    width: rS(150),
    height: rS(100),
    borderRadius: rS(10),
    marginRight: rS(10),
  },

  closeButton: {
    position: "absolute",
    top: rS(30),
    right: rS(20),
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: rS(20),
    padding: rS(5),
  },
});