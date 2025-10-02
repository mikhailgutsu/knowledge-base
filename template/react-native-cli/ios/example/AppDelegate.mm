#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import "RNFBMessagingModule.h"
#import <Firebase.h> // Firebase
#import <AuthenticationServices/AuthenticationServices.h> // Facebook
#import <SafariServices/SafariServices.h> // Facebook
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h> // Facebook
#import <GoogleSignIn/GoogleSignIn.h> // Google Signin 
#import <React/RCTLinkingManager.h> // Deep linking
#import <UserNotifications/UserNotifications.h> // User Notifications
#import <CallKit/CallKit.h> // Call management framework (handling VoIP calls)
#import <PushKit/PushKit.h> // Handling VoIP Push Notifications

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"example";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

  // Firebase
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // Facebook SDK
  [FBSDKApplicationDelegate.sharedInstance initializeSDK];

  // Import old defaults from the old bundle identifier
  NSUserDefaults *currentDefaults = [NSUserDefaults standardUserDefaults];
    if (![currentDefaults boolForKey:@"importedOldDefaultsFromexample"]) {
        // Read the old defaults from the old bundle identifier
        NSUserDefaults *oldDefaults = [NSUserDefaults new];
        NSDictionary *oldDefaultsDict = [oldDefaults persistentDomainForName:@"group.org.reactjs.native.example"];
        
        if (oldDefaultsDict) {
            // Store the old defaults in the standard user defaults
            [currentDefaults setPersistentDomain:oldDefaultsDict forName:[[NSBundle mainBundle] bundleIdentifier]];
            
            // Set the flag to avoid subsequent import of old defaults
            [currentDefaults setBool:YES forKey:@"importedOldDefaultsFromexample"];
        }
  }

  dispatch_async(dispatch_get_main_queue(), ^{
      [[UNUserNotificationCenter currentNotificationCenter]
          requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound + UNAuthorizationOptionBadge)
          completionHandler:^(BOOL granted, NSError * _Nullable error) {
              if (granted) {
                  dispatch_async(dispatch_get_main_queue(), ^{
                      [[UIApplication sharedApplication] registerForRemoteNotifications];
                  });
              }
          }];
  });

  self.pushRegistry = [[PKPushRegistry alloc] initWithQueue:dispatch_get_main_queue()];
  self.pushRegistry.delegate = self;
  self.pushRegistry.desiredPushTypes = [NSSet setWithObject:PKPushTypeVoIP];

  CXProviderConfiguration *configuration = [[CXProviderConfiguration alloc] init];
  configuration.supportsVideo = NO;
  configuration.includesCallsInRecents = NO;
  configuration.maximumCallsPerCallGroup = 1;
  configuration.ringtoneSound = @"intercom.aiff";

  self.callProvider = [[CXProvider alloc] initWithConfiguration:configuration];
  self.callController = [[CXCallController alloc] init];
  [self.callProvider setDelegate:self queue:dispatch_get_main_queue()];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
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

// Social Auth + Deep Linking (Custom URL Schemes)
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }

  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }
  
  return NO;
}

// Deep Linking (Universal Links)
- (BOOL)application:(UIApplication *)application
    continueUserActivity:(NSUserActivity *)userActivity
      restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

// Firebase deviceToken - FirebaseAppDelegateProxyEnabled false
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [FIRMessaging messaging].APNSToken = deviceToken;
    NSLog(@"Registered for remote notifications with token: %@", deviceToken);
}

// Add this method to handle notification interactions
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       didReceiveNotificationResponse:(UNNotificationResponse *)response
       withCompletionHandler:(void (^)(void))completionHandler {
    
    NSString *identifier = response.notification.request.identifier;
    NSLog(@"Notification with identifier %@ was interacted", identifier);
    
    // Cancel the missed call notification if the main notification is interacted with
    [center removePendingNotificationRequestsWithIdentifiers:@[identifier]];
    
    completionHandler();
}

- (void)reportIncomingCallWithUUID:(NSUUID *)uuid sender:(NSString *)sender {
    CXHandle *handle = [[CXHandle alloc] initWithType:CXHandleTypeGeneric value:sender];
    CXCallUpdate *callUpdate = [[CXCallUpdate alloc] init];
    callUpdate.remoteHandle = handle;
    callUpdate.hasVideo = NO;
    callUpdate.supportsHolding = NO;
    callUpdate.supportsGrouping = NO;
    callUpdate.supportsUngrouping = NO;

    CXProviderConfiguration *configuration = [[CXProviderConfiguration alloc] init];
    configuration.supportsVideo = NO;
    configuration.includesCallsInRecents = NO;
    configuration.ringtoneSound = @"intercom.aiff";

    CXProvider *provider = [[CXProvider alloc] initWithConfiguration:configuration];
    [provider reportNewIncomingCallWithUUID:uuid update:callUpdate completion:^(NSError *error) {
        if (error) {
          NSLog(@"Error reporting incoming call: %@", error.localizedDescription);
        }
    }];
}

- (void)endCall {
    if (!self.currentCallUUID) return;

    CXEndCallAction *endCallAction = [[CXEndCallAction alloc] initWithCallUUID:self.currentCallUUID];
    CXTransaction *transaction = [[CXTransaction alloc] initWithAction:endCallAction];

    [self.callController requestTransaction:transaction completion:^(NSError *error) {
        if (error) {
            NSLog(@"Error ending call: %@", error.localizedDescription);
        } else {
            NSLog(@"Call ended successfully");
        }
    }];
    
    self.currentCallUUID = nil;
}

- (void)provider:(CXProvider *)provider performStartCallAction:(CXStartCallAction *)action {
    self.currentCallUUID = action.callUUID;
    [action fulfill];
}

- (void)provider:(CXProvider *)provider performAnswerCallAction:(CXAnswerCallAction *)action {
    self.currentCallUUID = action.callUUID;
    [action fulfill];
}

- (void)provider:(CXProvider *)provider performEndCallAction:(CXEndCallAction *)action {
    self.currentCallUUID = nil;
    [action fulfill];
}

- (void)providerDidReset:(CXProvider *)provider {
    self.currentCallUUID = nil;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground ||
        [UIApplication sharedApplication].applicationState == UIApplicationStateInactive) {
        if ([userInfo[@"pushType"] isEqualToString:@"voip"]) {
            [self reportIncomingCallWithUUID:[NSUUID UUID] sender:userInfo[@"serialNumbber"]];
        }
    }
    completionHandler(UIBackgroundFetchResultNewData);
}

- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
    if (type == PKPushTypeVoIP) {
        NSData *deviceTokenData = credentials.token;

        NSString *deviceTokenHexString = [self hexStringFromData:deviceTokenData];

        // This token need to validate
        // https://icloud.developer.apple.com/dashboard/notifications/teams/N5Z27GKYT5/app/org.reactjs.native.example/tools/validateDeviceToken
        // and send
        // https://icloud.developer.apple.com/dashboard/notifications/teams/N5Z27GKYT5/app/org.reactjs.native.example/notifications/
        NSLog(@"Received VoIP device token (Hex): %@", deviceTokenHexString);
    }
}

// hexStringFromData VoIP token
- (NSString *)hexStringFromData:(NSData *)data {
    const unsigned char *dataBuffer = (const unsigned char *)[data bytes];
    NSMutableString *hexString = [NSMutableString stringWithCapacity:(data.length * 2)];
    
    for (int i = 0; i < data.length; ++i) {
        [hexString appendFormat:@"%02lx", (unsigned long)dataBuffer[i]];
    }
    
    return [hexString copy];
}



- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type {
    if (type == PKPushTypeVoIP) {
        NSString *sender = payload.dictionaryPayload[@"sender"];
        [self reportIncomingCallWithUUID:[NSUUID UUID] sender:sender];
        [self scheduleMissedCallNotificationForSender:sender];
    }
}

- (void)scheduleMissedCallNotificationForSender:(NSString *)sender {
    UNMutableNotificationContent *missedCallContent = [[UNMutableNotificationContent alloc] init];
    missedCallContent.title = @"Missed Call";
    missedCallContent.body = [NSString stringWithFormat:@"From %@", sender];
    
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    BOOL isMuteApp = [userDefaults boolForKey:@"isMuteApp"];
    NSArray *mutedDevices = [userDefaults arrayForKey:@"mutedDevices"];
    BOOL isDeviceMuted = [mutedDevices containsObject:sender];
    
    if (isMuteApp || isDeviceMuted) {
        missedCallContent.sound = nil;
    } else {
        missedCallContent.sound = UNNotificationSound.defaultSound;
    }
    
    missedCallContent.badge = @0;

    NSString *imagePath = [[NSBundle mainBundle] pathForResource:@"notification-missed-call" ofType:@"png"];
    if (imagePath) {
        NSError *error = nil;
        UNNotificationAttachment *attachment = [UNNotificationAttachment attachmentWithIdentifier:@"missedCallImage" URL:[NSURL fileURLWithPath:imagePath] options:nil error:&error];
        if (!error) {
            missedCallContent.attachments = @[attachment];
        } else {
            NSLog(@"Failed to create attachment: %@", error);
        }
    }

    UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:70 repeats:NO];
    
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"missedCall" content:missedCallContent trigger:trigger];
    
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            NSLog(@"Failed to schedule missed call notification: %@", error.localizedDescription);
        }
    }];
}


@end
