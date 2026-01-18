// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'clock.fill': 'schedule',
  'chart.bar.fill': 'bar-chart',
  'gear': 'settings',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
} as const;

export function IconSymbol({
  name,
  size = 24,
  color = '#000',
  style,
}: {
  name: string;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name as keyof typeof MAPPING] || name as any;
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
