import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useTheme from "../Hooks/useTheme";
import { mS } from "../Styles/responsive";

import Settings from "../Pages/Common/Settings";
import StudentProfile from "../Pages/Students/StudentProfile";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminNewsList from "../Pages/Admin/AdminNewsList";
import AdminNewsForm from "../Pages/Admin/AdminNewsForm";
import AdminUsersList from "../Pages/Admin/AdminUsersList";
import AdminUserDetail from "../Pages/Admin/AdminUserDetail";
import AdminAssignEnrollment from "../Pages/Admin/AdminAssignEnrollment";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function useTabScreenOptions() {
  const theme = useTheme();
  return {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: theme.secondary,
      height: 60,
    },
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.textSec,
    tabBarLabelStyle: {
      fontSize: 14,
      fontWeight: "bold",
    },
  };
}

function AdminHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboardMain" component={AdminDashboard} />
      <Stack.Screen name="AdminUsersList" component={AdminUsersList} />
      <Stack.Screen name="AdminUserDetail" component={AdminUserDetail} />
      <Stack.Screen
        name="AdminAssignEnrollment"
        component={AdminAssignEnrollment}
      />
    </Stack.Navigator>
  );
}

function AdminNewsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminNewsList" component={AdminNewsList} />
      <Stack.Screen name="AdminNewsForm" component={AdminNewsForm} />
    </Stack.Navigator>
  );
}

function AdminSettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminSettingsMain" component={Settings} />
      <Stack.Screen name="Profile" component={StudentProfile} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  const tabScreenOptions = useTabScreenOptions();

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="AdminHomeTab"
        component={AdminHomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminNewsTab"
        component={AdminNewsStack}
        options={{
          tabBarLabel: "News",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="note-add" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminSettingsTab"
        component={AdminSettingsStack}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={mS(24)} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
