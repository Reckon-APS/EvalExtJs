Ext.define('RM.controller.PayTransRefundC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PayTransRefund',
    config: {
        refs: {
            payTransRefund: 'paytransrefund',
            notesFld: 'paytransrefund #notes',
            reasonFld: 'paytransrefund #reason',
            amountFld: 'paytransrefund #amount'
        },
        control: {            
            'paytransrefund #refund': {
                tap: 'refund'
            },
            'paytransrefund #notes':{
                tap: 'onNotesTap'
            },
            'paytransrefund #back': {
                tap: 'back'
            }
        }
     },
    
    showView: function (data) {
        this.data = data;
        var view = this.getPayTransRefund();
        if (!view){
            view = { xtype: 'paytransrefund' };
        }       
        RM.ViewMgr.showPanel(view);
        this.loadData();
    },   
    
    loadData: function(){
        this.getAmountFld().setValue(this.data.Amount);
        this.noteText = '';        
    },
    
    refund: function(){
           
    },
    
    onNotesTap: function(){
      RM.Selectors.showNoteText(
            'Notes',
            true,
            'Save',
            this.noteText,
            function(noteText){
                RM.ViewMgr.back();
                this.noteText = noteText;
                this.getNotesFld().setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );   
    },
    
    back: function () {
        RM.ViewMgr.back();
    }     
});