#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "baseInteraction.h"

typedef enum : NSUInteger {
  IRUnknown = 0,
  IRuserSelection,
  IRuserInput,
  IRdisplayMessage,
  IRsignatureCapture,
  IRlowBattery,
} MPEbaseInteractionResultType;

/*! Base abstract interaction object. Defines the minimum properties an interaction
 requires.
 @param type MPEbaseInteractionResultType - enum identifing the kind of interaction.
 Set automatically by the concrete implementation class.
 @param txnRef NSString - transaction reference that identifies which transaction this
 interaction is a part of.
 @param interactionRef NSString - refence that identifies the particular interaction.
 */
@interface MPEbaseInteractionResult : NSObject

@property (readonly) MPEbaseInteractionResultType type;
@property (nonatomic, copy) NSString* txnRef;
@property (nonatomic, copy) NSString* interactionRef;

/*! Test method to verify that you have supplied enough details for the result to
 be considered valid. This is intended primarily as a sanity check for the framework
 API to quickly decide to pass on the result or not. Values should be checked to be
 in range and defined enough for processing by each concrete implementation of this 
 class.
 @return BOOL - YES, class has sensible parameters. NO - class needs further data.
 */
-(BOOL) isValid;

@end

/*! Returns the choice made by a user for a selection interaction.
 @param selection NSString - menu item selected by the user.
 */
@interface MPEuserSelectionInteractionResult : MPEbaseInteractionResult

@property NSString* selection;

@end

/*! Returns the result of a User Input Interaction. A valid result is considered to
 be one that has a non nil value object that matches the input type set.
 @param accepted - BOOL. YES for accepted, NO for canceled.
 @param type MPEinputStyle. Needs to be either   ISBoolean, ISCurrency,
 ISDate, ISNumeric, ISString.
 @param value value returned by the user. Needs to match the input type
 selected. (So NSNumber for Boolean (0 or 1), Numeric and Currency. NSDate for Date.
 NSString for ISString.)
 */
@interface MPEuserInputInteractionResult : MPEbaseInteractionResult

@property BOOL accepted;
@property MPEinputStyle inputStyle;
@property id value;

@end

/*! Returns the result of display message interaction. Intended to let the user
  cancel a display message or (optionally) accept a message and move on.
 @param accepted BOOL - YES for accepted pressed, NO for canceled.
 */
@interface MPEdisplayMessageInteractionResult : MPEbaseInteractionResult

@property BOOL accepted;

@end

/*! Returns the result of a signature capture.
 @param accepted BOOL - YES for signature entered, NO for cancel of signature sign.
 @param signature UIImage - image of the signature to be presented.
 */
@interface MPEsignatureCaptureInteractionResult : MPEbaseInteractionResult

@property BOOL accepted;
@property UIImage* signature;

@end

/*! Returns whether accept or cancel was pressed on the lowBattery interaction.
 @param accepted BOOL - YES for accepted pressed, NO for cancel pressed.
 */
@interface MPElowBatteryInteractionResult : MPEbaseInteractionResult

@property BOOL accepted;

@end