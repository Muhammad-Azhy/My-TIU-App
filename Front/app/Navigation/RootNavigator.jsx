import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useTheme from '../Hooks/useTheme';

import TLogin from "../Pages/Guests/TLogin";
import News from "../Pages/Common/News";
import StudentNavigator from "./StudentNavigator";
import InstructorNavigator from "./InstructorNavigator";
import AdminNavigator from "./AdminNavigator";
import Header from "../Components/Header/Header";
import Dashboard from "../Pages/Common/Dashboard";
import Courses from "../Pages/Students/Courses";
import Departments from "../Pages/Guests/Departments";
import { mS } from "../Styles/responsive";
import DepartmentDetails from "../Pages/Guests/DepartmentDetails";
import Settings from "../Pages/Common/Settings";
import StudentProfile from "../Pages/Students/StudentProfile";
import { stackFadeOptions, stackSlideOptions } from "./transitions";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Moved into a component so hooks are valid
function TabScreenOptions() {
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

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={stackFadeOptions}>
      <Stack.Screen name="DashboardHome" component={Dashboard} />
      <Stack.Screen name="GuestSettings" component={Settings} />
      <Stack.Screen name="Profile" component={StudentProfile} />
      <Stack.Screen name="Courses" component={Courses} />
    </Stack.Navigator>
  );
}

function DepartmentsStack() {
  return (
    <Stack.Navigator screenOptions={stackSlideOptions}>
      <Stack.Screen name="DepartmentsHome" component={Departments} />
      <Stack.Screen name="DepartmentDetails" component={DepartmentDetails} />
    </Stack.Navigator>
  );
}

function GuestTabs() {
  const tabScreenOptions = TabScreenOptions(); // ✅ called inside component
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={mS(24)} color={color} />
          ),
          tabBarLabel: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Departments"
        component={DepartmentsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="apartment" size={mS(24)} color={color} />
          ),
          tabBarLabel: "Departments",
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="article" size={mS(24)} color={color} />
          ),
          tabBarLabel: "News",
        }}
      />
      <Tab.Screen
        name="Login"
        component={TLogin}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="login" size={mS(24)} color={color} />
          ),
          tabBarLabel: "Login",
        }}
      />
    </Tab.Navigator>
  );
}

function GuestStack({ userRole }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GuestTabs"
        component={GuestTabs}
        options={{
          header: (props) => <Header {...props} userRole={userRole} />,
        }}
      />
    </Stack.Navigator>
  );
}

function StudentStack({ userRole }) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} userRole={userRole} />,
      }}
    >
      <Stack.Screen name="StudentTabs" component={StudentNavigator} />
    </Stack.Navigator>
  );
}

function InstructorStack({ userRole }) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} userRole={userRole} />,
      }}
    >
      <Stack.Screen name="InstructorTabs" component={InstructorNavigator} />
    </Stack.Navigator>
  );
}

function AdminStack({ userRole }) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} userRole={userRole} />,
      }}
    >
      <Stack.Screen name="AdminTabs" component={AdminNavigator} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const role = useSelector((state) => state.user.role);

  return (
    <>
      {role === "guest" && <GuestStack userRole={role} />}
      {role === "student" && <StudentStack userRole={role} />}
      {role === "lecturer" && <InstructorStack userRole={role} />}
      {role === "admin" && <AdminStack userRole={role} />}
      {role !== "guest" &&
        role !== "student" &&
        role !== "lecturer" &&
        role !== "admin" && <GuestStack userRole={role} />}
    </>
  );
}