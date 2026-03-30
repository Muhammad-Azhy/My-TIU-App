import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useTheme from '../Hooks/useTheme';

import TLogin from "../Pages/Guests/TLogin";
import Login from "../Pages/Guests/Login";
import Chat from "../Pages/Common/Chat";
import News from "../Pages/Common/News";
import Header from "../Components/Header/Header";
import Dashboard from "../Pages/Common/Dashboard";
import MoreInfo from "../Pages/Guests/MoreInfo";
import Courses from "../Pages/Students/Courses";
import Departments from "../Pages/Guests/Departments";
import { mS } from "../Styles/responsive";
import DepartmentDetails from "../Pages/Guests/DepartmentDetails";
import Settings from "../Pages/Common/Settings";

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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={Dashboard} />
      <Stack.Screen name="GuestSettings" component={Settings} />
      <Stack.Screen name="Courses" component={Courses} />
    </Stack.Navigator>
  );
}

function DepartmentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

function StudentTabs() {
  const tabScreenOptions = TabScreenOptions(); // ✅
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="News" component={News} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  const tabScreenOptions = TabScreenOptions(); // ✅
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="News" component={News} />
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
        header: (props) => <Header {...props} role={userRole} />,
      }}
    >
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
    </Stack.Navigator>
  );
}

function AdminStack({ userRole }) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const role = useSelector((state) => state.user.role);
  console.log("Nav Role:" + role);

  if (!role) return <AuthStack />;
  if (role === "guest") return <GuestStack userRole={role} />;
  if (role === "student") return <StudentStack />;
  if (role === "admin") return <AdminStack />;

  return <GuestStack />;
}