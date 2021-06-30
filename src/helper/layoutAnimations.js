import { LayoutAnimation } from 'react-native';

export const CustomLayoutSpring = {
    duration: 350,
    create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.8
    },
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.8
    }
};

export const CustomLayoutLinear = {
    duration: 225,
    create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.easeInEaseOut,
    }
};