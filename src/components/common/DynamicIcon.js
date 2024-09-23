import React from 'react';
import {View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as RegularIcons from '@fortawesome/free-regular-svg-icons';

export const DynamicIcon = ({iconName, color}) => {
  // Convert iconName from kebab-case to PascalCase for dynamic key lookup
  const toPascalCase = (str) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  const iconKey = `fa${toPascalCase(iconName)}`;

  // Check for the icon in solid, brand, and regular sets
  const icon =
    SolidIcons[iconKey] || BrandIcons[iconKey] || RegularIcons[iconKey];

  return (
    <View>
      {
        icon ? <FontAwesomeIcon icon={icon} size={20} color={color} /> : null
        // Uncomment the line below to show a default icon if not found
        // : <FontAwesomeIcon icon={SolidIcons.faQuestionCircle} size={20} color={color} />
      }
    </View>
  );
};
