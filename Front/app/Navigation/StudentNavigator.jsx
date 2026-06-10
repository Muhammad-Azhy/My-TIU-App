import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useTheme from "../Hooks/useTheme";
import { mS } from "../Styles/responsive";

import News from "../Pages/Common/News";
import Settings from "../Pages/Common/Settings";
import Courses from "../Pages/Students/Courses";
import StudentHome from "../Pages/Students/StudentHome";
import StudentAnnouncements from "../Pages/Students/StudentAnnouncements";
import StudentAnnouncementDetail from "../Pages/Students/StudentAnnouncementDetail";
import StudentProfile from "../Pages/Students/StudentProfile";
import StudentAssignments from "../Pages/Students/StudentAssignments";
import { stackFadeOptions, stackSlideOptions } from "./transitions";

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

function StudentHomeStack() {
  return (
    <Stack.Navigator screenOptions={stackFadeOptions}>
      <Stack.Screen name="StudentHomeMain" component={StudentHome} />
      <Stack.Screen
        name="StudentAnnouncements"
        component={StudentAnnouncements}
      />
      <Stack.Screen
        name="StudentAnnouncementDetail"
        component={StudentAnnouncementDetail}
      />
    </Stack.Navigator>
  );
}

function StudentCoursesStack() {
  return (
    <Stack.Navigator screenOptions={stackSlideOptions}>
      <Stack.Screen name="StudentCoursesList" component={Courses} />
      <Stack.Screen name="StudentAssignments" component={StudentAssignments} />
    </Stack.Navigator>
  );
}

function StudentSettingsStack() {
  return (
    <Stack.Navigator screenOptions={stackFadeOptions}>
      <Stack.Screen name="StudentSettingsMain" component={Settings} />
      <Stack.Screen name="Profile" component={StudentProfile} />
    </Stack.Navigator>
  );
}

export default function StudentNavigator() {
  const tabScreenOptions = useTabScreenOptions();

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="StudentHomeTab"
        component={StudentHomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentCoursesTab"
        component={StudentCoursesStack}
        options={{
          tabBarLabel: "Courses",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentNewsTab"
        component={News}
        options={{
          tabBarLabel: "News",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="article" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentSettingsTab"
        component={StudentSettingsStack}
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
