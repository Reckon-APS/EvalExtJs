#import <Foundation/Foundation.h>

@class MPEbaseInteraction;

@protocol MPEinteractionDelegate <NSObject>

-(void)MPEinteractionEvent: (MPEbaseInteraction*) interaction;

@end

typedef enum : NSUInteger {
  ITUnknown = 0,
  ITClose,
  ITDisplayMessage,
  ITError,
  ITLowBattery,
  ITPinEntry,
  ITSignatureCapture,
  ITUserInput,
  ITUserSelection,
  ITInteractionTypeCount
} MPEinteractionType;

typedef enum : NSUInteger {
  DMUnknown = 0,
  DMGeneral,
  DMInsertCard,
  DMRemoveCard,
  DMResult,
  DMScrollableText,
  DMdisplayMessageStyleCount
} MPEdisplayMessageStyle;

typedef enum : NSUInteger {
  CTUnknown = 0,
  CTChip,
  CTSwipe,
  CTChipAndSwipe,
  CTCardTypeCount
} MPEcardType;

typedef enum : NSUInteger {
  SSUnknown = 0,
  SSTable,
  SSAccountSelect,
  SSApplicationSelect,
  SSAdminMenuSelect,
  SSSelectionStyleCount
} MPEselectionStyle;

typedef enum : NSUInteger {
  ISUnknown = 0,
  ISBoolean,
  ISCurrency,
  ISDate,
  ISNumeric,
  ISString,
  ISInputStyleCount
} MPEinputStyle;

typedef enum : NSUInteger {
  SIUnknown = 0,
  SIsubmenu,
  SIitem,
  SIselectionItemStyleCount
} MPEselectionItemStyle;

@interface MPEselectionEntry : NSObject

@property NSString* title;
@property MPEselectionItemStyle style;

@end

// Abstract base class declaration.
@interface MPEbaseInteraction : NSObject<NSCopying>

@property NSString* title;
@property NSString* interactionRef;
@property NSString* txnRef;
@property NSString* transactionID;
@property NSDate* timestamp;
@property NSNumber* timeout;
@property (readonly) MPEinteractionType interactionType;

@end

/*! Interaction event to indicate that you should close the current interaction that
 is displayed. Does not indicate the end of an interaction conversation, merely that
 the current display needs to be closed. */
@interface MPEcloseInteraction : MPEbaseInteraction

@end

@interface MPEdisplayMessageInteraction : MPEbaseInteraction

@property NSString* message;
@property MPEdisplayMessageStyle messageStyle;
@property BOOL showWaitCursor;
@property BOOL showCancel;
@property BOOL showAccept;
@property MPEcardType cardType;

@end

@interface MPEerrorInteraction : MPEbaseInteraction

@property NSString* message;

@end

@interface MPElowBatteryInteraction : MPEbaseInteraction

@property NSString* message;
@property NSNumber* batteryLevel;
@property BOOL showCancel;
@property BOOL showAccept;

@end

@interface MPEpinEntryInteraction : MPEbaseInteraction

@property NSString* message;
@property NSNumber* numberOfDigits;
@property NSString* applicationType;
@property NSNumber* amountTotal;

@end

@interface MPEsignatureCaptureInteraction : MPEbaseInteraction

@property BOOL showCancel;
@property BOOL showAccept;

@end

/*! Generic request for user input to be returned.
 The default value is what the value should be set to when offered to the user. This
 should be appropriate for the selectio The cancel and accept titles are for the 
 accept/cancel buttons to let them be customised as required – may be nil.
 
 A MPEuserInputInteractionResult will be returned containing the actual value picked 
 plus the accept or cancel status. Interaction flow requires that the accept button
 is always present.
 */
@interface MPEuserInputInteraction : MPEbaseInteraction

/*! Default value to display. Must be typed correctly for the desired input type. */
@property id defaultValue;

@property MPEinputStyle inputType;
@property NSString* message;
@property NSString* cancelTitle;
@property NSString* acceptTitle;
@property BOOL showCancel;

@end

@interface MPEuserSelectionInteraction : MPEbaseInteraction

@property NSArray* selectionList;
@property MPEselectionStyle selectionStyle;

@end