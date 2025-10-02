#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MuteApp, NSObject)

RCT_EXTERN_METHOD(getMuteAppState:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(setMuteAppState:(BOOL)state)

@end
