#ifndef MPEAPI_MPEError_h
#define MPEAPI_MPEError_h

static NSString* kMPEerrorDomain = @"MPEAPI";

/*! Master enum of all error codes the MPE API will return.
 */
typedef enum : NSUInteger {
  Unknown = 0,
  NoInteractionDelegate,
  // Server response error codes for transaction processing go here.
  AuthBase = 1000,
} MPEerror;

#endif
