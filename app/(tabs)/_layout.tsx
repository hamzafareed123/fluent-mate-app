import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTheme } from '@/providers/ThemeProvider';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={typeof color === 'string' ? color : colors.primary} size={size} />,
        }}
      />
      <Tabs.Screen
        name="speak"
        options={{
          title: 'Speak',
          tabBarIcon: ({ color, size }) => <Ionicons name="mic" color={typeof color === 'string' ? color : colors.primary} size={size} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" color={typeof color === 'string' ? color : colors.primary} size={size} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" color={typeof color === 'string' ? color : colors.primary} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={typeof color === 'string' ? color : colors.primary} size={size} />,
        }}
      />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
