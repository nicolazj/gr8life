import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={Colors.tint}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        {Platform.select({
          ios: <Icon sf="house.fill" />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />,
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="review">
        <Label>Review</Label>
        {Platform.select({
          ios: <Icon sf="chart.bar.fill" />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="bar-chart" />} />,
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
