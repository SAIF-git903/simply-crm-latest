import React from 'react';
import {View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as RegularIcons from '@fortawesome/free-regular-svg-icons';

// Icon name mapping for common icons
const iconNameMap = {
  'clipboard-list': 'faClipboardList',
  'calendar': 'faCalendar',
  'calendar-alt': 'faCalendarAlt',
  'dollar-sign': 'faDollarSign',
  'diagram-project': 'faDiagramProject',
  'home': 'faHome',
  'building': 'faBuilding',
  'user': 'faUser',
  'handshake': 'faHandshake',
  'circle': 'faCircle',
  'list-check': 'faListCheck',
  'tasks': 'faTasks',
  'list': 'faList',
  'check-square': 'faCheckSquare',
  'cart-shopping': 'faCartShopping',
  'hand-holding-dollar': 'faHandHoldingDollar',
  'user-check': 'faUserCheck',
  'clock': 'faClock',
  'truck-field': 'faTruckField',
  'ticket': 'faTicket',
  'file-lines': 'faFileLines',
  'file-invoice': 'faFileInvoice',
  'file-invoice-dollar': 'faFileInvoiceDollar',
  'th-large': 'faThLarge',
  'th': 'faTh',
};

export const DynamicIcon = ({iconName, size, color}) => {
  if (!iconName) {
    console.warn('DynamicIcon: No iconName provided');
    return null;
  }

  // Try to get the icon key from the map first
  let iconKey = iconNameMap[iconName];
  
  // If not in map, convert from kebab-case to PascalCase
  if (!iconKey) {
    const toPascalCase = (str) => {
      return str
        ?.split('-')
        ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
        ?.join('');
    };
    iconKey = `fa${toPascalCase(iconName)}`;
  }

  // Check for the icon in solid, brand, and regular sets
  const icon =
    SolidIcons[iconKey] || BrandIcons[iconKey] || RegularIcons[iconKey];

  console.log('DynamicIcon:', {iconName, iconKey, found: !!icon});

  if (!icon) {
    console.warn(`Icon not found: ${iconName} (${iconKey})`);
    // Return a fallback circle icon instead of null
    const fallbackIcon = SolidIcons.faCircle;
    if (fallbackIcon) {
      return <FontAwesomeIcon icon={fallbackIcon} size={size} color={color} />;
    }
    return null;
  }

  return <FontAwesomeIcon icon={icon} size={size} color={color} />;
};
