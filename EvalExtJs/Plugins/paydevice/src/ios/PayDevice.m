#import "PayDevice.h"
#import <Cordova/CDV.h>
#import "MPEAPI.h"

NSString *callBackId;

@implementation PayDevice

    -(void)doTransaction:(CDVInvokedUrlCommand*)command
    {
        [self.commandDelegate runInBackground:^{
            NSLog(@"%@.",[command.arguments objectAtIndex:0]);  

            //NSNumberFormatter * f = [[NSNumberFormatter alloc] init];
            //[f setNumberStyle:NSNumberFormatterDecimalStyle];
            //NSNumber * amount = [f numberFromString:[command.arguments objectAtIndex:0]];
            
            NSLog(@"Converted amount to number.");
            [[NSUserDefaults standardUserDefaults] setObject:@"https://mpos-global.test.point.fi:450/" 
                                              forKey:@"paymentengineurl"];  
            NSLog(@"Changed to NZ/AU.");    
            callBackId = command.callbackId;   
            //NSLog(@"%@ amount = ", amount);         
			[MPEAPI instance].interactionDelegate = self;
			
			/*MPEpurchaseTransaction* transaction = [MPEpurchaseTransaction new];
			Transaction.amountPurchase = 95.00f;

			NSError* errorPtr;
            if (![[MPEAPI instance] MPEsubmitTransaction:transaction error:&errorPtr)
            {
            	//Report any error for the failed submit. Use an alert view with
            	// the error object for example.
            }

            //[MPEAPI initiatePurchaseTransactionWithInfo:@{@"amount": @"200.00", @"currency" : @"AUD"} andDelegate:self];*/
        }];
    }

	-(void)MPEinteractionEvent:(MPEbaseInteraction*) interaction
    {
        MPEinteractionType interactionType = interaction.interactionType;

        switch(interactionType)
        {
            case ITDisplayMessage :
            {
                MPEdisplayMessageInteraction* displayInteraction = (MPEdisplayMessageInteraction*) interaction;

				NSLog(@"%@.",displayInteraction.message);  
                //[self displayMessageInteraction:displayInteraction];

				break;
            }
			case ITPinEntry :
            {
                MPEpinEntryInteraction* displayInteraction = (MPEpinEntryInteraction*) interaction;

				NSLog(@"%@.",displayInteraction.message);  
                //[self displayMessageInteraction:displayInteraction];

				break;
            }
            default:
            {
            	// Unknown interaction event.
				NSLog(@"No interaction");  
            	NSAssert(NO, @"Unknown interaction event encountered.");
				break;
            }
        }
    }

	/*-(void) MPEtransactionResult:(MPETransactionStatus)transactionStatus transaction:(MPEbaseTransaction*)transaction error:(NSError*)error
	{
		/*switch(transactionStatus)
		{
			case accepted:
			{
				// Let the user know it worked.
				//[self displaySuccesfulTransaction:transaction];
				break;
			}
			case declined:
            {
            	//[self displayDeclinedTransaction:transaction];
				break;
            }
            case error:
            {
            	//[self displayTransactionError:transaction error:error];
				break;
            }
            default:
            {
            	NSAssert(NO,@"Unknown transaction status received.");
				break;
            }
		}
	}*/

	-(void)transactionWasSuccesfulWithResults:(NSDictionary *)results
    {
        NSLog(@"Success."); 

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:results];

        [self.commandDelegate sendPluginResult:pluginResult callbackId:callBackId];
    }

    /*-(void)transactionWasSuccesfulWithResults:(NSDictionary *)results
    {
        NSLog(@"Success."); 

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:results];

        [self.commandDelegate sendPluginResult:pluginResult callbackId:callBackId];
    }

    -(void)transactionFailedWithResults:(NSDictionary *)results
    {
        NSLog(@"Failure."); 

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:results];

        [self.commandDelegate sendPluginResult:pluginResult callbackId:callBackId];
    }

    -(void)presentTransactionList:(NSArray *)transactionList
    {

    }

    - (void)isSecureDeviceConnected:(CDVInvokedUrlCommand*)command
    {
        BOOL isDeviceConnected = [MPEAPI isSecureDeviceConnected];

        NSLog(@"%@",isDeviceConnected);        

        NSMutableDictionary *jsonObj = [[NSMutableDictionary alloc] init];
        [jsonObj setValue:[NSNumber numberWithBool:isDeviceConnected] forKey:@"DeviceConnected"];

        CDVPluginResult *pluginResult = [ CDVPluginResult
                                      resultWithStatus    : CDVCommandStatus_OK
                                      messageAsDictionary : jsonObj
                                    ];
    
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }*/

@end