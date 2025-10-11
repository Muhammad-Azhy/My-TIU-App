import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { rS, mS } from "../../Styles/responsive";

export default function DepartmentDetails({ route }) {
  const { dept } = route.params;

  // Hard-coded fallback images
  const fallbackPhotos = [
    { uri: "https://picsum.photos/400/300?random=1" },
    { uri: "https://picsum.photos/400/300?random=2" },
    { uri: "https://picsum.photos/400/300?random=3" },
    { uri: "https://picsum.photos/400/300?random=4" },
  ];

  const photos =
    dept.photos && dept.photos.length > 0 ? dept.photos : fallbackPhotos;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: dept.color }]}>
        <MaterialIcons name={dept.icon} size={mS(50)} color="#fff" />
        <Text style={styles.title}>{dept.name}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>About the Department</Text>
        <Text style={styles.description}>
          {dept.description || "No description available yet."}
        </Text>

        <Text style={styles.sectionTitle}>Tuition & Fees</Text>
        <Text style={styles.description}>
          {dept.tuition || "Tuition info coming soon."}
        </Text>

        <Text style={styles.sectionTitle}>Other Info</Text>
        <Text style={styles.description}>
          {dept.otherInfo || "Additional info will be added."}
        </Text>

        {/* --- Photo Gallery --- */}
        <Text style={styles.sectionTitle}>Photo Gallery</Text>
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.photo} />
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  sectionTitle: {
    fontSize: rS(18),
    fontWeight: "bold",
    marginTop: rS(12),
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
});
