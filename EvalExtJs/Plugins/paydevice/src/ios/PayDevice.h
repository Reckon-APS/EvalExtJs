#import <Cordova/CDV.h>
#import "MPEAPI.h"

@interface PayDevice : CDVPlugin <MPEinteractionDelegate>

- (void)doTransaction:(CDVInvokedUrlCommand*)command;    
- (void)MPEinteractionEvent: (MPEbaseInteraction*) interaction;
//- (void)isSecureDeviceConnected:(CDVInvokedUrlCommand*)command;

@property (nonatomic, strong) NSNumber *amount;

@end
