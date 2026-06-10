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
import BackBar from "../../Components/ui/BackBar";
import FadeSlideIn from "../../Components/animations/FadeSlideIn";
import AppCard from "../../Components/ui/AppCard";

export default function DepartmentDetails({ route }) {
  const { dept } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();

  const deptColor =
    theme.mode === "dark" ? dept["dark-color"] : dept["light-color"];

  const dummyPhotos = [
    { uri: "https://picsum.photos/400/300?random=101" },
    { uri: "https://picsum.photos/400/300?random=102" },
    { uri: "https://picsum.photos/400/300?random=103" },
  ];

  const imageUrls = dummyPhotos.map((img) => ({ url: img.uri }));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <BackBar title={dept.name} />

      <FadeSlideIn>
        <View style={[styles.header, { backgroundColor: deptColor }]}>
          <View style={styles.headerIcon}>
            <MaterialIcons name={dept.icon} size={mS(44)} color="#fff" />
          </View>
          <Text style={styles.title}>{dept.name}</Text>
          {dept.code ? <Text style={styles.code}>{dept.code}</Text> : null}
        </View>
      </FadeSlideIn>

      <View style={styles.content}>
        <FadeSlideIn delay={60}>
          <AppCard theme={theme} style={styles.cardSpacing}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              About the Department
            </Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              {dept.description || "No description available yet."}
            </Text>
          </AppCard>
        </FadeSlideIn>

        <FadeSlideIn delay={100}>
          <AppCard theme={theme} style={styles.cardSpacing}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Tuition & Fees
            </Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              {dept.tuition || "Tuition info coming soon."}
            </Text>
          </AppCard>
        </FadeSlideIn>

        {dept.facultyCount ? (
          <FadeSlideIn delay={140}>
            <AppCard theme={theme} style={styles.cardSpacing}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Faculty
              </Text>
              <Text style={[styles.description, { color: theme.subText }]}>
                {dept.facultyCount} faculty members
              </Text>
            </AppCard>
          </FadeSlideIn>
        ) : null}

        <FadeSlideIn delay={180}>
          <AppCard theme={theme}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Photo Gallery
            </Text>
            <FlatList
              data={dummyPhotos}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setModalVisible(true);
                  }}
                  activeOpacity={0.88}
                >
                  <Image source={item} style={styles.photo} />
                </TouchableOpacity>
              )}
            />
          </AppCard>
        </FadeSlideIn>
      </View>

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
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
  container: { flex: 1 },
  header: {
    marginHorizontal: rS(16),
    marginTop: rS(8),
    padding: rS(22),
    alignItems: "center",
    borderRadius: rS(16),
  },
  headerIcon: {
    width: rS(72),
    height: rS(72),
    borderRadius: rS(36),
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vS(10),
  },
  title: {
    fontSize: rS(22),
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  code: {
    marginTop: rS(6),
    fontSize: rS(13),
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  content: {
    padding: rS(16),
    paddingBottom: rS(32),
  },
  cardSpacing: {
    marginBottom: rS(10),
  },
  sectionTitle: {
    fontSize: rS(17),
    fontWeight: "700",
    marginBottom: rS(8),
  },
  description: {
    fontSize: rS(15),
    lineHeight: rS(22),
  },
  photo: {
    width: rS(150),
    height: rS(100),
    borderRadius: rS(10),
    marginRight: rS(10),
    marginTop: rS(8),
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
