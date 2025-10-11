import React, { useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import Announcment from "../../Components/Other/Announcement";
import Logo from "../../../assets/boot.png";
import Logo2 from "../../../assets/background.png";
import { mS, rS, vS } from "../../Styles/responsive";

// generate dummy announcements
const generateDummyNews = (startId, count = 5) => {
  const arr = [];
  for (let i = startId; i < startId + count; i++) {
    arr.push({
      id: i.toString(),
      title: `Dummy News ${i}`,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quasi nesciunt cupiditate, unde quisquam inventore, possimus est laborum rerum voluptatem blanditiis in earum reiciendis voluptas?",
      date: "8/27/2025",
      images: i % 2 === 0 ? [Logo, Logo2] : [Logo], // some have 1, some have 2
    });
  }
  return arr;
};

const News = () => {
  const [newsData, setNewsData] = useState(generateDummyNews(1, 5));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);

  const loadMoreNews = () => {
    if (loading) return;
    setLoading(true);

    // simulate network delay
    setTimeout(() => {
      const moreNews = generateDummyNews((page - 1) * 5 + 1, 5);
      setNewsData([...newsData, ...moreNews]);
      setPage(page + 1);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Announcment
            id={item.id}
            title={item.title}
            desc={item.desc}
            date={item.date}
            images={item.images}
          />
        )}
        onEndReached={loadMoreNews}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && (
            <ActivityIndicator
              size="large"
              color="#000"
              style={{ margin: vS(10) }}
            />
          )
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
