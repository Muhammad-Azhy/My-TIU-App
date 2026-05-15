import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../../Styles/theme";
import Announcment from "../../Components/Other/Announcement";
import { vS, rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { guestApi, getApiErrorMessage } from "../../services/api";
import PageHeader from "../../Components/ui/PageHeader";
import EmptyState from "../../Components/ui/EmptyState";
import Icon from "react-native-vector-icons/MaterialIcons";

const FEATURED_COUNT = 5;

function FeaturedSlide({ item, theme, slideWidth }) {
  const excerpt = (item.content || "").replace(/\s+/g, " ").trim();
  const preview =
    excerpt.length > 140 ? `${excerpt.slice(0, 140)}…` : excerpt || "Tap below for full story.";
  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <View style={[styles.slidePage, { width: slideWidth }]}>
      <View style={[styles.slideCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.slideBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.slideBadgeText}>Featured</Text>
        </View>
        <Icon name="article" size={mS(42)} color={theme.subText} style={{ marginBottom: vS(8) }} />
        <Text style={[styles.slideTitle, { color: theme.text }]} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={[styles.slidePreview, { color: theme.subText }]}>{preview}</Text>
        {dateStr ? (
          <Text style={[styles.slideDate, { color: theme.subText }]}>{dateStr}</Text>
        ) : null}
      </View>
    </View>
  );
}

export default function News() {
  useScreenPerformance("News Screen");
  const { width: windowWidth } = useWindowDimensions();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(windowWidth);
  const carouselRef = useRef(null);
  const autoTimer = useRef(null);

  const mode = useSelector((state) => state.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const featured = useMemo(
    () => newsData.slice(0, Math.min(FEATURED_COUNT, newsData.length)),
    [newsData],
  );
  const feed = useMemo(() => newsData.slice(featured.length), [newsData, featured.length]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await guestApi.news();
        setNewsData(Array.isArray(response.data) ? response.data : []);
      } catch (apiError) {
        setNewsData([]);
        setError(getApiErrorMessage(apiError, "Failed to load news."));
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // ── Auto-scroll timer ─────────────────────────────────────────────
  const startAutoTimer = useCallback(
    (featuredLen, width) => {
      if (autoTimer.current) clearInterval(autoTimer.current);
      if (featuredLen <= 1) return;
      autoTimer.current = setInterval(() => {
        setSlideIndex((prev) => {
          const next = (prev + 1) % featuredLen;
          if (carouselRef.current) {
            carouselRef.current.scrollTo({ x: next * width, animated: true });
          }
          return next;
        });
      }, 6500);
    },
    [],
  );

  useEffect(() => {
    startAutoTimer(featured.length, carouselWidth);
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [featured.length, carouselWidth, startAutoTimer]);

  // ── Dot sync via onScroll (continuous, works for both manual & auto) ──
  const onCarouselScroll = useCallback(
    (e) => {
      const x = e.nativeEvent.contentOffset.x;
      const w = carouselWidth || windowWidth || 1;
      const i = Math.round(x / w);
      const clamped = Math.max(0, Math.min(i, featured.length - 1));
      setSlideIndex(clamped);
    },
    [carouselWidth, featured.length, windowWidth],
  );

  // ── Restart timer after a manual swipe ───────────────────────────
  const onCarouselScrollEnd = useCallback(
    (e) => {
      startAutoTimer(featured.length, carouselWidth);
    },
    [featured.length, carouselWidth, startAutoTimer],
  );

  const renderFeedItem = useCallback(
    ({ item }) => (
      <Announcment
        id={item.id}
        title={item.title}
        desc={item.content}
        date={new Date(item.createdAt).toLocaleDateString()}
        images={[]}
        theme={theme}
      />
    ),
    [theme],
  );

  // ── Carousel section (no useMemo so slideIndex is always current) ──
  const renderCarousel = () => {
    if (loading) {
      return (
        <View style={styles.skeletonBlock}>
          <View style={[styles.skelLine, { backgroundColor: theme.border }]} />
          <View style={[styles.skelLineShort, { backgroundColor: theme.border }]} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={{ marginBottom: rS(12) }}>
          <Text style={[styles.bannerErr, { color: "#b00020" }]}>{error}</Text>
        </View>
      );
    }
    if (!featured.length) {
      return (
        <EmptyState
          icon="newspaper"
          title="No news yet"
          message="Check back when new stories are published."
          theme={theme}
        />
      );
    }
    return (
      <View style={{ marginBottom: vS(16) }}>
        <Text style={[styles.sectionLabel, { color: theme.subText, paddingHorizontal: rS(12) }]}>
          Highlights
        </Text>
        <ScrollView
          ref={carouselRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width || windowWidth)}
          onScroll={onCarouselScroll}
          onMomentumScrollEnd={onCarouselScrollEnd}
          decelerationRate="fast"
        >
          {featured.map((item) => (
            <FeaturedSlide key={item.id} item={item} theme={theme} slideWidth={carouselWidth} />
          ))}
        </ScrollView>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {featured.map((_, i) => (
            <Pressable
              key={String(i)}
              onPress={() => {
                setSlideIndex(i);
                if (carouselRef.current) {
                  carouselRef.current.scrollTo({ x: i * carouselWidth, animated: true });
                }
                startAutoTimer(featured.length, carouselWidth);
              }}
              hitSlop={8}
            >
              <View
                style={[
                  styles.dot,
                  i === slideIndex
                    ? { backgroundColor: theme.primary, width: 18, borderRadius: 4 }
                    : { backgroundColor: theme.border },
                ]}
              />
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && !newsData.length ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: vS(24) }}
        />
      ) : null}
      <FlatList
        data={feed}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <View style={styles.headerPad}>
              <PageHeader
                title="News"
                subtitle="University updates, events, and announcements from campus."
                theme={theme}
              />
            </View>
            <View style={styles.carouselBleed}>{renderCarousel()}</View>
            {!loading && !error && feed.length > 0 ? (
              <Text style={[styles.sectionLabel, { color: theme.subText, marginBottom: vS(8) }]}>
                All stories
              </Text>
            ) : null}
          </>
        }
        renderItem={renderFeedItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && !error && newsData.length === 0 ? (
            <EmptyState
              icon="feed"
              title="Nothing to show"
              message="There are no news items in the feed yet."
              theme={theme}
            />
          ) : !loading && !error && feed.length === 0 && featured.length > 0 ? (
            <Text style={{ textAlign: "center", color: theme.subText, marginTop: vS(8) }}>
              All current stories are highlighted above.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerPad: {
    paddingHorizontal: rS(16),
    paddingTop: rS(8),
    marginBottom: vS(4),
  },
  carouselBleed: {
    marginHorizontal: -rS(12),
  },
  listContent: {
    paddingHorizontal: rS(12),
    paddingBottom: rS(32),
  },
  sectionLabel: {
    fontSize: mS(13),
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: vS(10),
    marginLeft: rS(4),
  },
  slidePage: {
    paddingHorizontal: rS(12),
    justifyContent: "center",
  },
  slideCard: {
    borderRadius: rS(16),
    borderWidth: StyleSheet.hairlineWidth,
    padding: rS(18),
    minHeight: vS(200),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  slideBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: rS(10),
    paddingVertical: vS(4),
    borderRadius: rS(8),
    marginBottom: vS(10),
  },
  slideBadgeText: {
    color: "#1a1a1a",
    fontWeight: "800",
    fontSize: mS(11),
    textTransform: "uppercase",
  },
  slideTitle: {
    fontSize: mS(20),
    fontWeight: "800",
    marginBottom: vS(8),
  },
  slidePreview: {
    fontSize: mS(14),
    lineHeight: mS(21),
  },
  slideDate: {
    marginTop: vS(12),
    fontSize: mS(12),
    fontWeight: "600",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: vS(10),
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bannerErr: {
    textAlign: "center",
    fontWeight: "600",
    padding: rS(12),
  },
  skeletonBlock: {
    paddingHorizontal: rS(16),
    marginBottom: vS(16),
  },
  skelLine: {
    height: vS(18),
    borderRadius: 8,
    marginBottom: vS(10),
    width: "100%",
    opacity: 0.35,
  },
  skelLineShort: {
    height: vS(18),
    borderRadius: 8,
    width: "55%",
    opacity: 0.35,
  },
});
