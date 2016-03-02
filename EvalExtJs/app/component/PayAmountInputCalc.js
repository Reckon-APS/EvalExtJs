Ext.define('RM.component.PayAmountInputCalc', {
    extend: 'Ext.Panel',
    xtype: 'payamountinputcalc',
	requires: ['RM.component.CalcKeypad'],
    config: {      
        control: {         
            'calckeypad': {
                keytap: 'onCalcKeyTap'
            },
            '#historyshowbtn': {
                tap: 'showHistory'
            },
            '#calculatorshowbtn':{
                tap: 'showCalculator'
            },
            '#historyhidebtn': {
                tap: 'hideHistory'
            },
            '#clearinputbtn': {
                tap: 'clearInputFieldAndHistory'
            },
            '#discountbtn': {
                tap: 'onDiscountTap'
            },
            '#surchargebtn': {
                tap: 'onSurchargeTap'
            },
            '#charge': {
                tap: 'onChargeBtnTap'
            },                       
            '#descriptionfield':{
                tap: 'showDescription'
            },
            '#more':{
                tap: 'showMoreOptions'
            }
        },
        
        cls: 'rm-whitebg',
        layout: 'vbox',            
        items:[             
                {
                    xtype: 'container',
                    docked: 'top',
                    scrollable: 'horizontal',
                    height: '4em',
                    margin: '25 0 0 0',
                    cls: 'rm-whitebg',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'button',                                                
                            cls: ['rm-white-flatbtn', 'rm-payamountinput-back-arrow'],
                            itemId: 'historyshowbtn',
                            hidden: true,
                            docked: 'left'
                        },{
                            xtype: 'button',                                                
                            cls: ['rm-white-flatbtn', 'rm-payamountinput-back-arrow'],
                            itemId: 'calculatorshowbtn',
                            hidden: true,
                            docked: 'left'
                        },{
                            xtype: 'button',                                                
                            cls: ['rm-white-flatbtn', 'rm-payamountinput-arrow'],
                            itemId: 'historyhidebtn',
                            hidden: true,
                            docked: 'right'
                        },{
                            xtype: 'component',
                            html: '0.00',
                            itemId: 'amount',
                            docked: 'right',
                            cls: 'rm-pay-amount'                                                
                        }                
                    ]
                },
                {
                    xtype: 'container',
                    itemId: 'inputandhistorycontainer',
                    flex: '1',
                    layout: 'card',
                    activeItem: 0,               
                    items: [
                        {
                            xtype: 'container',
                            cls: 'rm-whitebg',
                            items: [
                                    {
                                        xtype: 'component',   
                                		itemId: 'totalcomponent',
                                        cls: ['rm-fontsize70', 'rm-colorgrey', 'rm-alignr', 'rm-p10'],
                                        html: '',
                                        hidden: true
                            },
                            {
                                        xtype: 'exttextfield',
                                        itemId: 'descriptionfield',
                                        cls: 'rm-flatfield',                                                                                   
                                        clearIcon: false,
                                        readOnly: true,
                                		hidden: true,
                                        placeHolder: 'Notes (optional)'                                                           
                                        
                            },{
                                        xtype: 'calckeypad',
                                		itemId: 'keypad',
                                        docked: 'bottom'  
                            },{                    
                                        xtype: 'button',
                                        itemId: 'charge',
                                        text: 'CHARGE',
                                        cls: ['rm-pay-charge-bg', 'rm-flatbtn'],
                                        docked: 'bottom'                        
                            },{
                                xtype: 'container',
                                layout: 'hbox',
                                itemId: 'optionscontainer',
                                docked: 'bottom',
                                items:[
                                	{
                                        xtype: 'button',
                                        itemId: 'clearinputbtn',                            
                                        ui: 'plain',
                                        width: '3em',
                                        text: 'CLR',
                                        cls: 'rm-colorgreenoptions',                             
                                        docked: 'right'
                                    },{
                                        xtype: 'button',
                                        itemId: 'more',   
                                        width: '4em',
                                        ui: 'plain',
                                        text: 'MORE',
                                        cls: 'rm-colorgreenoptions',                                   
                                        docked: 'left'
                                    }
                                ]
                            },{
                              	xtype: 'container',
                                  layout: 'hbox',
                                  itemId: 'discountsurchargecontainer',
                                  docked: 'bottom',
                                  hidden: true,
                                  items: [
                                			{
                                                xtype: 'button',
                                                itemId: 'discountbtn',
                                                text: '<div class="rm-fintsize275">-</div><br>DISCOUNT',
                                                flex: '1',
                                                cls: ['rm-pay-discount-bg', 'rm-bigbtn', 'rm-flatbtn']
                                            },{
                                                xtype: 'button',
                                                itemId: 'surchargebtn',
                                                text: '<div class="rm-fintsize275">+</div><br>SURCHARGE',
                                                flex: '1',
                                                cls: ['rm-pay-surcharge-bg', 'rm-bigbtn', 'rm-flatbtn']
                                            }
                                ]                                  
                            }
                    ]
                }
                ,{
                       xtype: 'container',
                       cls: ['rm-whitebg', 'rm-border1px'],
                       scrollable: 'vertical',
                       html: '',
                       styleHtmlContent: true,
                       styleHtmlCls: ['rm-p10', 'rm-fontsize70', 'rm-pay-graytext'],
                       itemId: 'historycontainer'
                }               
        	]
            }           
         ] 
    },    
    
    initialize: function(){
        this.callParent(arguments);         
        this.inputStr = '';
        this.inputArray = new Array();
        this.inputArrayIndex = 0;
        this.noteText = '';     
        this.amountAfterDiscount = 0;
        this.discount = 0;
        this.surcharge = 0;
    }, 
    
    getHistoryHideBtn: function(){
        return this.down("#historyhidebtn");
    },   
    
    getHistoryShowBtn: function(){
        return this.down("#historyshowbtn");
    },
    
    getCalculatorShowBtn: function(){
        return this.down("#calculatorshowbtn");
    },
    
    getClearInputBtn: function(){
        return this.down('#clearinputbtn');  
    },
    
    getHistoryContainer: function(){
        return this.down('#historycontainer');  
    },
    
    getInputAndHistoryContainer: function(){
        return this.down('#inputandhistorycontainer');  
    },
    
    getAmount: function(){   
       return this.down('#amount');      
    },
    
    getDiscount: function(){
        return this.down('#discount');  
    },
    
    getDescriptionFld: function(){
        return this.down('#descriptionfield');  
    }, 
    
    getKeypad: function(){
        return this.down('#keypad');
    },
    
    getOptionsContainer: function(){
        return this.down('#optionscontainer');
    },
    
    getDiscountSurchargeContainer: function(){
        return this.down('#discountsurchargecontainer');
    },
    
    getTotalValueComponent: function(){
        return this.down('#totalcomponent');
    },
    
    loadData: function(data, callback, callbackScope){        
        this.data = {};
        if(data){
            this.data.InvoiceId = data.InvoiceId;
            this.data.AccountsReceivableCategoryId  = data.AccountsReceivableCategoryId;
            this.data.CustomerSupplierId = data.CustomerId;
            this.data.BankAccountId = data.BankAccountId;
            this.data.CustomerEmail = data.CustomerEmail;
        }       
        this.callback = callback;
        this.callbackScope = callbackScope;        
        this.clearInputFieldAndHistory();
        var amountToPay = 0;
        if(data && data.BalanceDue){
            amountToPay = typeof data === "undefined" ? 0 : parseFloat(data.BalanceDue);
        }
        else if(data && data.Amount){
            amountToPay = typeof data === "undefined" ? 0 : parseFloat(data.Amount);
        }
        if(amountToPay){
            this.inputStr = '' + amountToPay.toFixed(2);
        }
        else{
            this.inputStr = '';
        }         
        this.getAmount().setHtml(this.inputStr ? this.inputStr : '<span class = "rm-pay-currencyprefix">$</span>0.00');
        var discount = 'None';
        if(data){
            if(data.DiscountPercent && data.DiscountPercent != 0){
                discount = data.DiscountPercent + '%';
            }
            else if(data.DiscountAmount && data.DiscountAmount != 0){
                discount = RM.AppMgr.formatCurrency(data.DiscountAmount, 2);
            }            
        }                     	
        //this.getDiscount().setValue(discount); 
        this.getDescriptionFld().setValue((data && data.Description) ? data.Description : '');
        this.noteText = this.getDescriptionFld().getValue();
    },
    
    onCalcKeyTap: function (key) {       
        var pointIndex = this.inputStr.indexOf('.');        
        if (key === 'back') {            
            if (this.inputStr.length > 0 && (this.inputStr.indexOf('=') === -1 ) && this.inputStr !== '*' && this.inputStr !== '+') {               
                this.inputStr = this.inputStr.slice(0, -1); 
            }
            if(this.inputArray.length === 0 && this.inputStr === ''){
                this.getHistoryShowBtn().setHidden(true); 
            	this.getAmount().setHtml('<span class = "rm-pay-currencyprefix">$</span>0.00'); 
                return;
            }  
        }  
        else if(key === '=' ){  
            if(this.inputStr.indexOf('=') === -1){
                this.addToInputHistory();            
                this.displayTotal(); 
                return;
            }                       
        }
        else if(key === 'x'){  
            if(this.inputStr === 'x' || (!this.inputArray.length && this.inputStr === '')){
               return;
            } 
            this.addToInputHistory();
            this.inputStr += '*';
        }else if(key === '+'){  
            if(this.inputStr === '+' || (!this.inputArray.length && this.inputStr === '')) {
               return;
            }
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
        if(this.getHistoryHideBtn().getHidden() && this.getCalculatorShowBtn().getHidden() && this.inputStr !== ''){
            this.getHistoryShowBtn().setHidden(false);  
        }
        this.getAmount().setHtml(this.showCurrencyPrefix(this.inputStr));
    },
    
    addToInputHistory: function(){
        if(this.inputStr === '+' || this.inputStr === '*' || this.inputStr === '=' || this.inputStr === '' || this.inputStr === '.' || this.inputStr === '+.' || this.inputStr === '*.'){
            this.inputStr = ''
            return;
        }         
        this.inputArray[this.inputArrayIndex] = this.formatNumber(this.inputStr);
        this.inputArrayIndex += 1; 
        this.inputStr = '';
    },
    
    displayTotal: function(){        
        this.inputStr = '=' + this.calculateTotal();        
        this.cleanCalcHistory();
        this.removeRedundantHistoryRows();
        if(this.inputStr === '=' || this.inputStr === '=undefined' || this.inputStr === '=NaN' || (this.inputStr === '=0' && this.inputArray.length === 0)) {
            this.inputStr = '';            
        }    
        this.getAmount().setHtml(this.inputStr ? this.showCurrencyPrefix(this.inputStr) : '<span class = "rm-pay-currencyprefix">$</span>0.00');        
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
            if(this.inputArray[0].indexOf('*') !== -1){
                this.inputArray.splice(0, 0, '0.00');
        		this.inputArrayIndex = this.inputArrayIndex + 1;                
            }
            try{
                var calcInput = ''
                for (var i=0; i < this.inputArray.length; i++){
                   if(this.inputArray[i].indexOf('=') !== -1){
                        calcInput = eval(calcInput);
                        calcInput = calcInput ? calcInput.toFixed(2) : calcInput;
                        calcInput ? this.inputArray[i] = '=' + calcInput : this.inputArray[i] = '+0.000000';
                        calcInput = this.inputArray[i].slice(1);
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
    
    cleanCalcHistory: function(){ 
        if(this.inputArray && this.inputArray.length === 0){
            
        	this.hideHistory();
            this.getHistoryShowBtn().setHidden(true);              
        }
        if(this.inputArray[0] === '+0.000000'){
                  this.inputArray[0] = '0.00';
        }  
        if(this.inputArray && this.inputArray.length > 0){
            for (var i=1; i < this.inputArray.length; i++){              
              if(this.inputArray[i] === '+0.000000'){
                  this.inputArray[i] = '=0.00';                  
              }
          } 
        }        
    },
    
    removeRedundantHistoryRows: function(){
       if (this.inputArray && this.inputArray.length > 0) {           
           for (var i = 1; i < this.inputArray.length; i++) {
               if (this.inputArray[i].indexOf('=') !== -1 && (this.inputArray[i] === this.inputArray[i - 1])) {                   
                   this.removeInputItem(i);
                   this.removeRedundantHistoryRows();
                   break;
               }
           } 
       }        
    },   
    
    validateAndCalculateAmount: function(){
        this.onCalcKeyTap('=');        
        if(!this.data){
            this.data = {}; 
        }
        this.data.Amount = 0;
        this.data.Description = "";
        this.data.PayerName = "";
        this.data.PaymentMethodId = 2;        
        this.data.Total = 0;    
        var discount = this.discount ? this.discount : '$0.00';
        var surcharge = this.surcharge ? this.surcharge : '$0.00';
        this.data.Amount = this.formatNumber(this.inputStr.slice(1)); 
        this.data.Description = this.getDescriptionFld().getValue();         
        this.data.DiscountPercent = null;
        this.data.DiscountAmount = null;        
        if (discount.indexOf('%') > -1) {
            this.data.DiscountPercent = discount.replace('%', '');
        }
        else if (discount.indexOf('$') > -1) {
            this.data.DiscountAmount = discount.replace('$', '');
        }   
        this.data.SurchargePercent = null;
        this.data.SurchargeAmount = null;        
        if (surcharge.indexOf('%') > -1) {
            this.data.SurchargePercent = surcharge.replace('%', '');
        }
        else if (surcharge.indexOf('$') > -1) {
            this.data.SurchargeAmount = surcharge.replace('$', '');
        }        
        if(this.validateForm(this.data)){ 
            this.totalWithSurchargeAndDiscount();            
            return true;
        }        
    },    
    
    onChargeBtnTap: function(){      
        if(this.validateAndCalculateAmount()){  
            RM.PayMgr.showScreen('PayTransTypeSelect', this.data, this.callback, this.callbackScope);
        }        
    },
    
    totalWithSurchargeAndDiscount: function() {
        var discount = 0;
        var total = 0;
        var surcharge = 0;
        var amount = parseFloat(this.data.Amount.replace('$', ''));       
        if(this.data.DiscountAmount){
            discount = parseFloat(this.data.DiscountAmount);
        }
        else if(this.data.DiscountPercent){            
            discount = (parseFloat(this.data.DiscountPercent)/100) * amount;
        }
        
        total = amount - discount;
        this.amountAfterDiscount = total; 
        if(this.data.SurchargeAmount){
            surcharge = parseFloat(this.data.SurchargeAmount);
        }
        else if(this.data.SurchargePercent){            
            surcharge = (parseFloat(this.data.SurchargePercent)/100) * total;
        }
        total = total + surcharge;
        this.data.Total = total.toFixed(2);
    },
    
    clearInputFieldAndHistory: function(){
        this.inputStr = '';
        this.inputArray = new Array();
        this.inputArrayIndex = 0;  
        this.amountAfterDiscount = 0;
        this.discount = 0;
        this.surcharge = 0;
        this.noteText = '';
        this.getDescriptionFld().setValue(''); 
        var historyContainer = this.getHistoryContainer();
        historyContainer.removeAll(true,true);         
        this.showCalculator();
        this.getHistoryShowBtn().setHidden(true);
        this.getTotalValueComponent().setHtml('');
        this.getAmount().setHtml('<span class = "rm-pay-currencyprefix">$</span>0.00');
    },
    
    showDescription: function(){        
        RM.Selectors.showNoteText(
            'Notes',
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
    
    showMoreOptions: function(){
        this.calculateAndUpdateTotal();        
        if(this.data.Amount){
            this.getKeypad().setHidden(true);
            this.getCalculatorShowBtn().setHidden(false);
            this.getHistoryHideBtn().setHidden(true);
            this.getHistoryShowBtn().setHidden(true);  
            this.getOptionsContainer().setHidden(true);
            this.getTotalValueComponent().setHidden(false);
            this.getDescriptionFld().setHidden(false);
            this.getDiscountSurchargeContainer().setHidden(false);        
        }           
    },
    
    showCalculator: function(){
        this.getKeypad().setHidden(false);
        this.getCalculatorShowBtn().setHidden(true);        
        this.getHistoryShowBtn().setHidden(false);
        this.getOptionsContainer().setHidden(false);
        this.getTotalValueComponent().setHidden(true);
        this.getDescriptionFld().setHidden(true);
        this.getDiscountSurchargeContainer().setHidden(true);
    },
    
    addRowsToInputHistory: function(){        
        var me = this;
        var historyContainer = this.getHistoryContainer();
        historyContainer.removeAll(true,true);        
        for (var i=0; i < this.inputArray.length; i++){
            
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
                    styleHtmlContent: true,
                    styleHtmlCls: ['rm-fontsize180', 'rm-payhistoryrowtextcolor', 'rm-pr5']                    
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
        if(this.inputArray && this.inputArray.length > 0 && (this.inputArray[this.inputArray.length-1].indexOf('=') === -1)){
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
                    styleHtmlContent: true,
                    styleHtmlCls: ['rm-fontsize180', 'rm-payhistoryrowtextcolor', 'rm-pr5']                    
                }
                ]
            }); 
        }                   
    },
    
    removeInputItem: function(index){        
        this.inputArray.splice(index,1);
        this.inputArrayIndex = this.inputArrayIndex - 1;
    },
    
    showHistory: function(){
        this.addRowsToInputHistory(); 
        this.getInputAndHistoryContainer().setActiveItem(1);  
        this.getHistoryHideBtn().setHidden(false);        
        this.getHistoryShowBtn().setHidden(true);     
    },
    
    hideHistory: function(){
        this.getInputAndHistoryContainer().setActiveItem(0);  
        this.getHistoryHideBtn().setHidden(true);        
        this.getHistoryShowBtn().setHidden(false);      
    },    
    
    calculateAndUpdateTotal: function(){
        var val = '';
        this.validateAndCalculateAmount();
        if(this.discount){
            val = val + '-' + this.discount + ' discount on $' +  this.formatValue(this.data.Amount) + ' (' + this.formatDiscountValue() + ')' + '<br>';
        }
        if(this.surcharge){
            val = val + '+' + this.surcharge + ' surcharge on $' +  this.formatValue(this.amountAfterDiscount) +  ' (' + this.formatSurchargeValue() + ')' + '<br>'
        }      		
        if(this.discount || this.surcharge){
            val = val + '<b>Amount to be charged ' + ' (' + '$' + this.formatValue(this.data.Total) + ')</b>'
        }     	  
        this.getTotalValueComponent().setHtml(val);  
    },
    
    formatDiscountValue: function(){
       var discount = '$0.00';
       if (!this.data.DiscountPercent && !this.data.DiscountAmount) {
           return discount; 
       }
       else if (this.data.DiscountPercent) {
           var amount = parseFloat(this.data.Amount);
           discount = (parseFloat(this.data.DiscountPercent) / 100) * amount;
           discount = '$' + discount.toFixed(2);
       }
       else if (this.data.DiscountAmount) {
           discount = '$' + this.data.DiscountAmount;
       }
       return discount;
    },
    
    formatSurchargeValue: function(){
       var surcharge = '$0.00';
       if (!this.data.SurchargePercent && !this.data.SurchargeAmount) {
           return surcharge; 
       }
       else if (this.data.SurchargePercent) {           
           surcharge = (parseFloat(this.data.SurchargePercent) / 100) * this.amountAfterDiscount;
           surcharge = '$' + surcharge.toFixed(2);
       }
       else if (this.data.SurchargeAmount) {
           surcharge = '$' + this.data.SurchargeAmount;
       }
       return surcharge;
    },
    
    formatValue: function(val, decimalPlaces){        
        if(!val){
            return '0.00';
        } 
        decimalPlaces ? decimalPlaces = decimalPlaces : decimalPlaces = 2;
        var result = val;        
        result = parseFloat(val);
        result = result.toFixed(decimalPlaces);    
        return result;       
    },
    
    onDiscountTap: function(){
        RM.ViewMgr.hideKeyPad();
        var me = this;    
        RM.PayMgr.showChooseDiscountPopup(
            me.discount,
			function (discount) {
                var newVal = (discount === 0 ? 'None' : discount);
                if(newVal !== me.discount){	    
                    me.discount = newVal;   
                    me.calculateAndUpdateTotal();
                }
			},
			this
		);
    },
    
    onSurchargeTap: function(){
        RM.ViewMgr.hideKeyPad();
        var me = this;    
        RM.PayMgr.showChooseDiscountPopup(
            me.surcharge,
			function (surcharge) {
                var newVal = (surcharge === 0 ? 'None' : surcharge);
                if(newVal !== me.surcharge){	    
                    me.surcharge = newVal;                    
                    me.calculateAndUpdateTotal();
                }
			},
			this,
        	'surcharge'
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
    
    validateForm: function(vals){        
        var isValid = true;        
        if( vals.Amount === undefined || vals.Amount === null || vals.Amount === ''){
            RM.AppMgr.showErrorMsgBox('Please enter in an amount');
            isValid = false;
        }       
        else if (vals.Amount <= 0) {
            RM.AppMgr.showErrorMsgBox('Please enter payment amount greater than $0.00');  
            isValid = false;
        }
        else if(vals.DiscountAmount) {
            var discount = parseFloat(vals.DiscountAmount);
            if(discount && discount >= vals.Amount){
                RM.AppMgr.showErrorMsgBox('Discount amount must be less than total amount');  
                isValid = false; 
            }            
        }
        else if(vals.SurchargeAmount) {
            var surcharge = parseFloat(vals.SurchargeAmount);
            if(surcharge && surcharge >= vals.Amount){
                RM.AppMgr.showErrorMsgBox('Surcharge amount must be less than total amount');  
                isValid = false; 
            }            
        }
        if(vals.BalanceDue){
            var balance = parseFloat(vals.BalanceDue);
            var amount = parseFloat(vals.Amount);            
            if(balance<amount){
                RM.AppMgr.showErrorMsgBox('Amount cannot be greater than balance due');  
                isValid = false;
            }
        }            
        return isValid;
    }
});