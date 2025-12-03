#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"  // here
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>

#if __has_include(<ReactAppDependencyProvider/ReactAppDependencyProvider.h>)
#import <ReactAppDependencyProvider/ReactAppDependencyProvider.h>
#else
#import "RCTAppDependencyProvider.h"
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"simplycrm";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  self.dependencyProvider = [RCTAppDependencyProvider new];
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [FIRApp configure];
  [RNSplashScreen show];
  return YES;
//  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

 - (BOOL) application: (UIApplication *)application
              openURL: (NSURL *)url
              options: (NSDictionary<UIApplicationOpenURLOptionsKey, id> *) options
 {
   if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
    return YES;
   }
   return [RCTLinkingManager application:application openURL:url options:options];
 }


- (BOOL) application: (UIApplication *) application
 continueUserActivity: (nonnull NSUserActivity *)userActivity
   restorationHandler: (nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
 {
   if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
    if (self.authorizationFlowManagerDelegate) {
      BOOL resumableAuth = [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:userActivity.webpageURL];
      if (resumableAuth) {
         return YES;
       }
     }
   }
   return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
 }

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
