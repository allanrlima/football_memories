import BarChartIcon from '@/assets/icons/bar-chart3.svg';
import BriefcaseIcon from '@/assets/icons/briefcase.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import { HapticTab } from '@/components/haptic-tab';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'rgb(0, 217, 100)',
        tabBarInactiveTintColor: '#8A95A2',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1,
        },
        tabBarStyle: {
          backgroundColor: '#171d24',
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'MATCHES',
          tabBarIcon: ({ color }) => <BriefcaseIcon width={22} height={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'STATS',
          tabBarIcon: ({ color }) => <BarChartIcon width={22} height={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'CONFIG',
          tabBarIcon: ({ color }) => <SettingsIcon width={22} height={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
