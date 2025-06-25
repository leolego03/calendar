import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, marginTop: 4, marginBottom: 4 },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={20}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="calendar-outline"
              size={20}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarLabel: "Library",
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="dumbbell"
              size={20}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="[username]"
        options={{
          tabBarLabel: "My page",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-outline"
              size={20}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}
