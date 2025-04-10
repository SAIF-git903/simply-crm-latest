import {createNavigationContainerRef} from '@react-navigation/native';
export let hasNavigatedToLogin = false; // Global flag
export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return null;
}
export function getCurrentRouteParams() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.params;
  }
  return null;
}

export function reset(routes, index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index,
      routes,
    });
  }
}
