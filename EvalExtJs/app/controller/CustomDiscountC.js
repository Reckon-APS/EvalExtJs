Ext.define('RM.controller.CustomDiscountC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.CustomDiscount'],
    config: {
        refs: {
            customDiscount: 'customdiscount',
            percentDiscount: 'customdiscount #percentDiscount',
            absoluteDiscount: 'customdiscount #absoluteDiscount',
            title: 'customdiscount #title'
        },
        control: {
            'customdiscount': {
                show: 'onShow'
            },            
            'customdiscount rmamountfield': {
                focus: 'onFieldFocus'
            },            
            'customdiscount #back': {
                tap: 'back'
            },
            'customdiscount #save': {
                tap: 'save'
            }
        }
    },

    showView: function (discVal, cb, cbs, title) {
        this.discVal = discVal;
        this.selectCb = cb;
        this.selectCbs = cbs;      
        this.title = title ? title : 'discount';         
        var view = this.getCustomDiscount();
        if (!view)
            view = { xtype: 'customdiscount' };
        RM.ViewMgr.showPanel(view);     
        this.getPercentDiscount().setLabel('% ' + this.title);
    	this.getAbsoluteDiscount().setLabel('$ ' + this.title);
        this.getTitle().setHtml('Custom ' + this.title);
    },

    onShow: function () {
        var disc = this.discVal, percDisc = this.getPercentDiscount();
        this.currentField = percDisc;
        this.clearFields();
        
        if (disc != 0) {
            var absDiscount = this.getAbsoluteDiscount();
            if (disc.indexOf('%') > -1) {
                percDisc.setValue(parseFloat(disc.replace('%', '')));
                absDiscount.setValue(null);
            }
            else {
                percDisc.setValue(null);
                absDiscount.setValue(RM.AppMgr.unformatCurrency(disc));
                this.currentField = absDiscount;
            }
        }
    },    
    
    onFieldFocus: function(tf){        
        this.currentField = tf;
        this.clearFields();
    },
    
    clearFields: function(){
        this.getPercentDiscount().setValue('');
        this.getAbsoluteDiscount().setValue('');
    },
    
    
    validateForm: function() {          
        var isValid = true;         
        var val1 = this.getPercentDiscount().getValue();
        var val2 = this.getAbsoluteDiscount().getValue();         
        if (!val1 && !val2) {
            isValid = false;
        }  
        if (val1 && val1 > 99) {
            isValid = false;            
            RM.AppMgr.showErrorMsgBox('% '+ this.title + ' cannot be greater than 99%');            
            return isValid;
        }
        if (!isValid) {            
            RM.AppMgr.showErrorMsgBox('Please enter a % ' + this.title + ' or $ '+ this.title + ' value greater than 0');            
        }         
        return isValid;
    },

    save: function () {         
        if(this.validateForm()){             
            var disc = this.getPercentDiscount().getValue();            
            if (disc) {
                disc = disc + '%';            
            }
            else {
                disc = RM.AppMgr.formatCurrency(this.getAbsoluteDiscount().getValue(), 2);
            }
            this.selectCb.call(this.selectCbs, disc);
            RM.ViewMgr.back();
        }        
    },

    back: function () {
        RM.ViewMgr.back();
    }

});
