import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../../Styles/theme";
import Announcment from "../../Components/Other/Announcement";
import { vS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { guestApi } from "../../services/api";

const News = () => {
  useScreenPerformance("News Screen");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mode = useSelector((state) => state.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    const fetchNews = async () => {
      console.log("[NEWS] fetch start");
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/8ac24eb4-5f94-4dbf-a6b4-b2fa5097aca3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "f8db7c",
        },
        body: JSON.stringify({
          sessionId: "f8db7c",
          runId: "initial",
          hypothesisId: "H5",
          location: "Pages/Common/News.jsx:fetchNews-start",
          message: "News fetch effect triggered",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setLoading(true);
      setError("");
      try {
        const response = await guestApi.news();
        console.log("[NEWS] fetch success", {
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 0,
        });
        setNewsData(response.data || []);
      } catch (apiError) {
        console.error("[NEWS] fetch failed", {
          status: apiError?.response?.status || null,
          message: apiError?.message || "unknown",
        });
        setError(apiError?.response?.data?.message || "Failed to load news.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: vS(16) }}
        />
      ) : null}
      {error ? (
        <Text style={{ color: "#d14343", textAlign: "center", marginBottom: vS(8) }}>
          {error}
        </Text>
      ) : null}
      <FlatList
        data={newsData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Announcment
            id={item.id}
            title={item.title}
            desc={item.content}
            date={new Date(item.createdAt).toLocaleDateString()}
            images={[]}
            theme={theme}
          />
        )}
        ListFooterComponent={
          loading && (
            <ActivityIndicator
              size="large"
              color={theme.primary}
              style={{ margin: vS(10) }}
            />
          )
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: "center", color: theme.subText }}>
              No news available.
            </Text>
          ) : null
        }
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
