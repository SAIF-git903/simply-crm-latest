module.exports = {
  project: {
    ios: {},
    android: {
      packageName: 'com.simplycrm.mobileappnew',
    },
  },
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-flipper': {
      platforms: {
        ios: null,
      },
    },
  },
};