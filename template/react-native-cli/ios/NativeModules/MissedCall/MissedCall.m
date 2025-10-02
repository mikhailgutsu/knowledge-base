#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MissedCall, NSObject)

RCT_EXTERN_METHOD(setMissedCall:(BOOL)hasMissedCall)
RCT_EXTERN_METHOD(getMissedCall:(RCTResponseSenderBlock)callback)

@end
