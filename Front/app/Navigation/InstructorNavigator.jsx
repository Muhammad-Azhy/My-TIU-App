import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useTheme from "../Hooks/useTheme";
import { mS } from "../Styles/responsive";

import News from "../Pages/Common/News";
import Settings from "../Pages/Common/Settings";
import Chat from "../Pages/Common/Chat";
import StudentProfile from "../Pages/Students/StudentProfile";
import InstructorHome from "../Pages/Instructor/InstructorHome";
import InstructorClasses from "../Pages/Instructor/InstructorClasses";
import InstructorPostAnnouncement from "../Pages/Instructor/InstructorPostAnnouncement";

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

function InstructorHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InstructorHomeMain" component={InstructorHome} />
      <Stack.Screen
        name="InstructorPostAnnouncement"
        component={InstructorPostAnnouncement}
      />
      <Stack.Screen name="InstructorMessages" component={Chat} />
    </Stack.Navigator>
  );
}

function InstructorClassesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InstructorClassesList" component={InstructorClasses} />
    </Stack.Navigator>
  );
}

function InstructorSettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InstructorSettingsMain" component={Settings} />
      <Stack.Screen name="Profile" component={StudentProfile} />
    </Stack.Navigator>
  );
}

export default function InstructorNavigator() {
  const tabScreenOptions = useTabScreenOptions();

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="InstructorHomeTab"
        component={InstructorHomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="InstructorClassesTab"
        component={InstructorClassesStack}
        options={{
          tabBarLabel: "Classes",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="school" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="InstructorNewsTab"
        component={News}
        options={{
          tabBarLabel: "News",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="article" size={mS(24)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="InstructorSettingsTab"
        component={InstructorSettingsStack}
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
