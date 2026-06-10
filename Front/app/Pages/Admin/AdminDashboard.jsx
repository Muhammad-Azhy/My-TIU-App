import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";

import { adminApi, getApiErrorMessage } from "../../services/api";
import PageHeader from "../../Components/ui/PageHeader";

function StatBox({ label, value, theme }) {
  return (
    <View style={[styles.statBox, { backgroundColor: theme.card }]}>
      <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.subText }]}>{label}</Text>
    </View>
  );
}

function QuickTile({ title, color, icon, onPress, theme }) {
  return (
    <Pressable
      style={[styles.tile, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={mS(48)}
        color="rgba(255,255,255,0.2)"
        style={styles.tileIcon}
      />
      <Text style={[styles.tileText, { color: theme.textSec }]}>{title}</Text>
    </Pressable>
  );
}

export default function AdminDashboard({ navigation }) {
  useScreenPerformance("Admin Dashboard Screen");

  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [stats, setStats] = useState({
    users: 0,
    departments: 0,
    news: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      setStatsError("");
      try {
        const response = await adminApi.dashboardStats();
        setStats({
          users: response.data.users || 0,
          departments: response.data.departments || 0,
          news: response.data.news || 0,
        });
      } catch (err) {
        setStats({ users: 0, departments: 0, news: 0 });
        setStatsError(getApiErrorMessage(err, "Could not load dashboard statistics."));
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  const goTab = (tabName, params) => {
    navigation.getParent()?.navigate(tabName, params);
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={{ paddingHorizontal: rS(4), marginBottom: rS(8) }}>
        <PageHeader
          title="Admin"
          subtitle="Overview and quick actions for live management flows."
          theme={theme}
        />
      </View>

      {statsLoading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: rS(12) }} />
      ) : null}
      {statsError ? (
        <Text style={[styles.statsErr, { color: "#b00020" }]}>{statsError}</Text>
      ) : null}

      <View style={styles.statsRow}>
        <StatBox label="News items" value={String(stats.news)} theme={theme} />
        <StatBox
          label="Users"
          value={String(stats.users)}
          theme={theme}
        />
        <StatBox label="Depts." value={String(stats.departments)} theme={theme} />
      </View>

      <Text style={[styles.section, { color: theme.subText }]}>Actions</Text>
      <View style={styles.row}>
        <QuickTile
          title="Manage news"
          color={theme.specialBoxes.courses}
          icon="article"
          theme={theme}
          onPress={() => goTab("AdminNewsTab", { screen: "AdminNewsList" })}
        />
        <QuickTile
          title="User directory"
          color={theme.specialBoxes.schedule}
          icon="people"
          theme={theme}
          onPress={() => navigation.navigate("AdminUsersList")}
        />
      </View>
      <View style={styles.row}>
        <QuickTile
          title="Assign enrollment"
          color={theme.specialBoxes.assignments}
          icon="how-to-reg"
          theme={theme}
          onPress={() => navigation.navigate("AdminAssignEnrollment")}
        />
        <QuickTile
          title="Settings"
          color={theme.specialBoxes.settings}
          icon="settings"
          theme={theme}
          onPress={() =>
            goTab("AdminSettingsTab", { screen: "AdminSettingsMain" })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(32) },
  statsErr: {
    fontSize: mS(14),
    fontWeight: "600",
    marginBottom: rS(12),
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: rS(8),
    marginBottom: rS(24),
  },
  statBox: {
    flex: 1,
    padding: rS(12),
    borderRadius: rS(12),
    alignItems: "center",
  },
  statValue: { fontSize: mS(20), fontWeight: "800" },
  statLabel: { fontSize: mS(11), marginTop: rS(4), textAlign: "center" },
  section: {
    fontSize: mS(14),
    fontWeight: "600",
    marginBottom: rS(10),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: rS(12),
  },
  tile: {
    width: "48%",
    height: rS(110),
    borderRadius: rS(12),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  tileSpacer: { width: "48%" },
  tileIcon: { position: "absolute" },
  tileText: {
    fontSize: mS(15),
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: rS(6),
  },
});
