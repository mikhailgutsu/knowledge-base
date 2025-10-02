#import <RCTAppDelegate.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>
#import <CallKit/CallKit.h>
#import <PushKit/PushKit.h>

@interface AppDelegate : RCTAppDelegate <UIApplicationDelegate, UNUserNotificationCenterDelegate, RCTBridgeDelegate, CXProviderDelegate, PKPushRegistryDelegate> // Conform to PKPushRegistryDelegate

@property (nonatomic, strong) CXProvider *callProvider;
@property (nonatomic, strong) CXCallController *callController;
@property (nonatomic, strong) NSUUID *currentCallUUID;
@property (strong, nonatomic) PKPushRegistry *pushRegistry;

@end
