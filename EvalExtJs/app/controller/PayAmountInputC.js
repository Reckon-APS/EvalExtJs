Ext.define('RM.controller.PayAmountInputC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.PayAmountInput'],
    config: {
        refs: {
            payAmountInput: 'payamountinput',            
            historyHideBtn: 'payamountinput #historyhidebtn',
            historyShowBtn: 'payamountinput #historyshowbtn',            
            clearInputBtn: 'payamountinput #clearinputbtn',
            historyContainer: 'payamountinput #historycontainer',
            inputAndHistoryContainer: 'payamountinput #inputandhistorycontainer',
            amount: 'payamountinput #amount',   
            //toolbarTitle: 'payamountinput #toolbarTitle',            
            discount: 'payamountinput #discount',
            descriptionFld: 'payamountinput #descriptionfield',
            backBtn: 'payamountinput #back'
        },
        
        control: {         
            'payamountinput calckeypad': {
                keytap: 'onCalcKeyTap'
            },
            'payamountinput #historyshowbtn': {
                tap: 'showOrHideHistory'
            },
            'payamountinput #historyhidebtn': {
                tap: 'showOrHideHistory'
            },
            'payamountinput #clearinputbtn': {
                tap: 'clearInputFieldAndHistory'
            },
            'payamountinput #discountbtn': {
                tap: 'onDiscountFldTap'
            },
            'payamountinput #camerabtn': {
                tap: 'onCameraBtnTap'
            },
            'payamountinput #charge': {
                tap: 'onChargeBtnTap'
            },
            'payamountinput #discount': {
                tap: 'onDiscountFldTap'
            },
            'payamountinput #back': {
                tap: 'back'  
            },
            'payamountinput #descriptionfield':{
                tap: 'showDescription'
            }
        }

    },
    
    init: function(){
        this.callParent(arguments);  
        this.data = {}; 
        this.inputStr = '';
        this.inputArray = new Array();
        this.inputArrayIndex = 0;
        this.noteText = '',        
        this.history = false;
    },
    
    showView: function (data, cb, cbs) {
        this.data = data;
        this.selectCb = cb;
        this.selectCbs = cbs;           
        var view = this.getPayAmountInput();
        if (!view){
            view = { xtype: 'payamountinput' };
        }       
        RM.ViewMgr.showPanel(view);
        //this.getBackBtn().setHidden(false);
        this.clearInputFieldAndHistory();
        var amountToPay = typeof data === "undefined" ? 0 : parseFloat(data.BalanceDue);
        if(amountToPay){
            this.inputStr = '' + amountToPay.toFixed(2);
        }
        else{
            this.inputStr = '';
        }
        this.getAmount().setHtml(this.inputStr);  
        this.getDiscount().setValue('None');        
        //this.getToolbarTitle().setHtml('Joe Plumber');       
    },  
    
    showViewFromOne: function (data, cb, cbs) {
        this.data = data;
        this.selectCb = cb;
        this.selectCbs = cbs;
          
        
        //this.getBackBtn().setHidden(true);
        this.clearInputFieldAndHistory(); 
        var amountToPay = typeof data === "undefined" ? 0 : parseFloat(data.AmountFromPay);  
        //this.getToolbarTitle().setHtml('Joe Plumber');
        if(amountToPay){
            this.inputStr = '' + amountToPay.toFixed(2);
        }
        else{
            this.inputStr = '';
        }
        this.getAmount().setHtml(this.inputStr);  
        this.getDiscount().setValue('None');
        this.getInputAndHistoryContainer().setActiveItem(0);
    },  
    
    onCalcKeyTap: function (key) {       
        var pointIndex = this.inputStr.indexOf('.');        
        if (key === 'back') {
            if (this.inputStr.length > 0 && (this.inputStr.indexOf('=') === -1 )) {               
                this.inputStr = this.inputStr.slice(0, -1); 
            }
        }  
        else if(key === '=' ){  
            if(this.inputStr.indexOf('=') === -1){
                this.addToInputHistory();            
                this.displayTotal(); 
            }                       
        }
        else if(key === 'x'){  
            if(this.inputStr === 'x') return;
            this.addToInputHistory();
            this.inputStr += '*';
        }else if(key === '+'){  
            if(this.inputStr === '+') return;
            this.addToInputHistory();
            this.inputStr += key;
        }
        else {           
            if(this.inputStr.indexOf('=') === -1 ){
                if(key === '.' && pointIndex !== -1){
                    return;
                }
                if(pointIndex !== -1 && (this.inputStr.length - pointIndex) >= 3){
                    return;
                }
                this.inputStr += key;
            }            
        }         
        this.getAmount().setHtml(this.showCurrencyPrefix(this.inputStr));
    },
    
    addToInputHistory: function(){
        if(this.inputStr === '+' || this.inputStr === '*' || this.inputStr === '=' || this.inputStr === ''){
            this.inputStr = ''
            return;
        }         
        this.inputArray[this.inputArrayIndex] = this.formatNumber(this.inputStr);
        this.inputArrayIndex += 1; 
        this.inputStr = '';
    },
    
    displayTotal: function(){           
        this.inputStr = '=' + this.calculateTotal();  
        if(this.inputStr === '=' || this.inputStr === '=undefined' || this.inputStr === '=NaN') {
            this.inputStr = '';
        }        
        this.getAmount().setHtml(this.showCurrencyPrefix(this.inputStr));
    },
    
    showCurrencyPrefix: function(val){         
        if(val.indexOf('=') >= 0){  
            val = this.formatNumber(val);
            val = val.replace('=','<span class = "rm-pay-currencyprefix">$</span>');
        }
        return val;
    },
    
    styleOperators: function(val){
        if(val.indexOf('$') > -1){
            val = val.replace('$', '= $');
        }
        else if(val.indexOf('=') > -1){
            val = val.replace('=', '<span class = "rm-pay-currencyprefix">= $</span>');
        }
        else if(val.indexOf('+') >= 0){
            val = val.replace('+', '<span class = "rm-pay-currencyprefix">+ </span>');
        }
        else if(val.indexOf('*') >= 0){
            val = val.replace('*', '<span class = "rm-pay-currencyprefix">* </span>');
        }
        return val;
    },
    
    calculateTotal: function(){
        if(this.inputArray && this.inputArray.length > 0){
            try{
                var calcInput = ''
                for (i=0; i < this.inputArray.length; i++){
                   if(this.inputArray[i].indexOf('=') !== -1){
                        calcInput = eval(calcInput);
                        calcInput = calcInput ? calcInput.toFixed(2) : calcInput;
                        calcInput ? this.inputArray[i] = '=' + calcInput : this.inputArray[i] = '+0.00';
                        calcInput = this.inputArray[i].slice(1)
                    }
                    else{
                        calcInput += this.inputArray[i];
                    }                    
                }                
                return eval(calcInput);
            }catch(e){
                RM.AppMgr.showErrorMsgBox(e.message);
            }           
        }
        return '';
    },
   
    onCameraBtnTap: function(){
        alert('camera btn tapped');
    },
    
    onChargeBtnTap: function(){
        this.onCalcKeyTap('=');
        console.log(this.data);
        
        /*this.data = {
            Amount: 0,
            Description: "",
            PayerName: "Travis Beesley",
            PaymentMethodId: 2,
            Discount: 0,
            Surcharge: 0,
            Total: 0,
        };*/
        
        
        this.data.AmountFromPay = 0;
        this.data.Description = "";
        this.data.PayerName = "";
        this.data.PaymentMethodId = 2;
        this.data.Discount = 0;
        this.data.Surcharge = 0;
        this.data.Total = 0;        
        
        var discVal = this.getDiscount().getValue();
        this.data.Discount = discVal ? discVal : '$0.00';
        this.data.AmountFromPay = this.formatNumber(this.inputStr.slice(1)); 
        this.data.Description = this.getDescriptionFld().getValue();
        if(this.validateForm(this.data)){ 
            this.totalWithSurchargeAndDiscount();
            RM.PayMgr.showScreen('PayTransTypeSelect', this.data);
        }        
    },
    
    totalWithSurchargeAndDiscount: function() {
        var discount = 0;
        var total = 0;
        var surcharge = parseFloat(this.data.Surcharge);
        var amount = parseFloat(this.data.AmountFromPay.replace('$', ''));
        if(this.data.Discount.indexOf('$') > -1){
            discount = parseFloat(this.data.Discount.replace('$', ''));
        }
        if(this.data.Discount.indexOf('%') > -1){
            
            discount = (parseFloat(this.data.Discount.replace('%', ''))/100) * amount;
        }
        total = amount - discount + surcharge;
        this.data.Total = total.toFixed(2);
    },
    
    clearInputFieldAndHistory: function(){
        this.inputStr = '';
        this.inputArray = new Array();
        this.inputArrayIndex = 0;
        this.getAmount().setHtml('');
        var historyContainer = this.getHistoryContainer();
        historyContainer.removeAll(true,true);
        this.history = true;
        this.showOrHideHistory();
    },
    
    showDescription: function(){        
        RM.Selectors.showNoteText(
            'Description',
            true,
            'Save',
            this.noteText,
            function(noteText){
                RM.ViewMgr.back();
                this.noteText = noteText;
                this.getDescriptionFld().setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );        
    },
    
    addRowsToInputHistory: function(){
        
        var me = this;
        var historyContainer = this.getHistoryContainer();
        historyContainer.removeAll(true,true);
        
        for (i=0; i < this.inputArray.length; i++){
            
            historyContainer.add({
                xtype: 'container',
                layout: 'hbox',  
                margin: 1,
                itemId: 'row'+i,
                items: [{
                    xtype: 'button',                    
                    ui: 'plain', 
                    iconCls: 'rm-btn-iconsize',
                    icon: 'resources/images/icons/rm-fieldclear.svg',
                    itemId: 'deletebtn',
                    margin: 5,
                    hidden: true,                    
                    handler: function(btn){                        
                        me.removeInputItem(parseInt(this.getParent().getItemId().replace('row','')));
                        me.displayTotal();
                        me.addRowsToInputHistory();
                    }
                },{
                    xtype: 'component', 
                    docked: 'right',
                    itemId: 'rowcontent',
                    margin: '2 5 2 5',
                    html: me.styleOperators(this.inputArray[i]),
                    //html: this.inputArray[i],
                    styleHtmlContent: true,
                    styleHtmlCls: ['rm-fontsize180', 'rm-payhistoryrowtextcolor', 'rm-pr5']
                    /*listeners: {
    								tap: {
    									element: 'element',                    
    									fn: function () {
                                           if(this.getHtml().indexOf('=') === -1){
                                                this.getParent().addCls('rm-lightgreenbg');                                            
    										    this.getParent().child('#deletebtn').setHidden(false);  
                                            }                                                                          
    									}
    								}
								}*/
                }
                ],
                listeners: {
                    tap: {
							element: 'element',                    
							fn: function () {
                                	
                                    if(me.inputArray[parseInt(this.getItemId().replace('row',''))].indexOf('=') === -1)
                                    {
                                            this.addCls('rm-lightgreenbg');                                            
    									    this.child('#deletebtn').setHidden(false);  
                                    } 
                            }
                    }
                }
            });
        }
        historyContainer.add({
                xtype: 'container',
                layout: 'hbox',  
                margin: 1,
                itemId: 'resultrow',
                items: [{
                    xtype: 'button',                    
                    ui: 'plain', 
                    iconCls: 'rm-btn-iconsize',
                    icon: 'resources/images/icons/rm-fieldclear.svg',
                    itemId: 'deletebtn',
                    margin: 5,
                    hidden: true                   
                },{
                    xtype: 'component', 
                    docked: 'right',   
                    margin: '2 5 2 5',
                    html: me.styleOperators(this.getAmount().getHtml()),
                    //html: this.getAmount().getHtml(),
                    styleHtmlContent: true,
                    styleHtmlCls: ['rm-fontsize180', 'rm-payhistoryrowtextcolor', 'rm-pr5']                    
                }
                ]
            });            
    },
    
    removeInputItem: function(index){        
        this.inputArray.splice(index,1);
        this.inputArrayIndex = this.inputArrayIndex - 1;
    },
    
    showOrHideHistory: function(){    
        this.history = !this.history;
        if(this.history ){
          this.addRowsToInputHistory(); 
          this.getInputAndHistoryContainer().setActiveItem(1);   
           
        }else{
          this.getInputAndHistoryContainer().setActiveItem(0);  
        }
        this.getHistoryHideBtn().setHidden(!this.history);
        this.getClearInputBtn().setHidden(this.history);
        this.getHistoryShowBtn().setHidden(this.history);        
    },
    
    onDiscountFldTap: function(){
        RM.ViewMgr.hideKeyPad(); 
        var discountFld = this.getDiscount();
        var oldVal = discountFld.getValue();
        RM.InvoicesMgr.showChooseDiscountPopup(
            oldVal == 'None' ? 0 : oldVal,
			function (disc) {
                var newVal = (disc == 0 ? 'None' : disc);
                if(newVal != oldVal){                        
				    discountFld.setValue(newVal);
                    oldVal = newVal;                    
                }
			},
			this
		);
    },
    
    formatNumber: function(val, decimalPlaces){        
        if(!val){
            return '';
        }
        decimalPlaces ? decimalPlaces = decimalPlaces : decimalPlaces = 2;
        var operator = '';
        var result = val;
        if(val.indexOf('+') !== -1 || val.indexOf('*') !== -1 || val.indexOf('=') !== -1) {
            operator = val.slice(0,1);
            val = val.slice(1);          
        } 
        result = parseFloat(val);
        result = operator + result.toFixed(decimalPlaces);    
        return result;       
    },
    
    
    back: function () {
        RM.ViewMgr.back();
    },
    
    validateForm: function(vals){        
        var isValid = true;
        
        if( vals.AmountFromPay === undefined || vals.AmountFromPay === null || vals.AmountFromPay === ''){
            RM.AppMgr.showErrorMsgBox('Please enter in an amount');
            isValid = false;
        }       
        else if (vals.AmountFromPay <= 0) {
            RM.AppMgr.showErrorMsgBox('Please enter payment amount greater than $0.00');  
            isValid = false;
        }
        else if(vals.Discount.indexOf('$') > -1 && vals.Discount) {
            var discount = parseFloat(vals.Discount.replace('$', ''));
            if(discount && discount >= vals.AmountFromPay){
                RM.AppMgr.showErrorMsgBox('Discount amount must be less than total amount');  
                isValid = false; 
            }            
        }
        /*else if (this.getAmount().getHtml().indexOf('=') == -1){
            RM.AppMgr.showErrorMsgBox('Please complete calculation and press =');  
            isValid = false;
        }*/
            
        return isValid;
    }
});
