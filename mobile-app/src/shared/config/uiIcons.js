import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export const StarIcon = ({ size = 14, color = '#f59e0b', style }) => (
  <MaterialIcons name="star" size={size} color={color} style={style} />
);

export const MapPinIcon = ({ size = 16, color = '#64748b', style }) => (
  <MaterialIcons name="place" size={size} color={color} style={style} />
);

export default {
  StarIcon,
  MapPinIcon,
};
