#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MuteDevice, NSObject)

RCT_EXTERN_METHOD(muteDevice:(NSString *)serialNumber state:(BOOL)state)
RCT_EXTERN_METHOD(isDeviceMuted:(NSString *)serialNumber callback:(RCTResponseSenderBlock)callback)

@end
