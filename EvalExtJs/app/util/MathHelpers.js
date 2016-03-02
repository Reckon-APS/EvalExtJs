Ext.define('RM.util.MathHelpers', {
    singleton: true,
    
    roundToEven: function (num, decimalPlaces) {  
        decimalPlaces = decimalPlaces || 0;
        var decimalShifter = Math.pow(10, decimalPlaces);

        // Shift the decimal point until the required precision is in the integer space
        var shifted = +(num * decimalShifter);
    
        // Split the integer and decimal parts or the result
        var integerPart = Math.floor(shifted);
        var decimalPart = shifted - integerPart;

        var result;    
        var tolerance = 1e-8;
        // if we're exactly midway (within a floating point representation tolerance), 
        // and the integral part of the number being rounded is even
        if (decimalPart - tolerance < 0.5 && decimalPart + tolerance > 0.5 && integerPart % 2 == 0) {
            // round down
            result = integerPart;
        }
        else {
            // leverage the default rounding function
            result = Math.round(shifted);
        }

        // Shift the decimal back to the original position 
        return result / decimalShifter;
    }
    
});