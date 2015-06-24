Ext.define('RM.component.RMMultiSelectField', {
    extend: 'RM.component.ExtTextField',    
    xtype: 'rmmultiselectfield',

    initialize: function () {
        this.callParent(arguments);
        this.setReadOnly(true);
        this.selectedOptions = this.config.selectedOptions || null;        
        this.on('tap', this.onTap, this);
        this.on('painted', this.onPainted, this);
    },

    onTap: function (field) {        
        this.showOptionList();        
    },

    onPainted: function () {
        if (this.selectedOptions) {
            this.setValue(this.createFieldTextFromSelection());
        }
    },

    showOptionList: function () {
        RM.ViewMgr.regBackHandler(this.hideOptionList, this);
        var optionsCount = !this.config.options ? 0 : this.config.options.length;
        var optionListHeight = optionsCount * 48;
        //240px height is to show five options if there are more options then scrollbar will appear
        var maxHeightOfList = optionListHeight > 240 ? 240 : optionListHeight
        this.popup = Ext.create('RM.component.Popup');
        this.popup.add({
            xtype: 'component',
            html: this.config.label || 'Select',
            cls: 'rm-title'
        });
        this.popup.add({
            xtype: 'panel',
            height: maxHeightOfList, 
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            items: [{
                xtype: 'formpanel',
                itemId: 'optionsform',
                scrollable: null

            }]
        });
        var optionForm = this.popup.down('#optionsform');
        if (this.config.options && optionsCount > 0) {
            this.config.options.forEach(function (item) {
                optionForm.add(
                    {
                        xtype: 'checkboxfield',
                        name : item.value,
                        label: item.text,
                        cls: 'rm-flatfield rm-alignl rm-multiselectfield'                        
                    }
                );
            }, this);
        }
        this.popup.add({
            xtype: 'button',
            text: 'DONE',            
            cls: 'rm-greenbtn-bg rm-flatbtn',
            handler: function () {
                this.onDoneTap();                
            },
            scope: this
        });
        this.loadSelection();
        this.popup.show();
    },

    loadSelection: function () {        
        if (this.selectedOptions) {
            var optionForm = this.popup.down('#optionsform');
            optionForm.setValues(this.selectedOptions);
        }
    },

    onDoneTap: function () {        
        this.selectedOptions = this.popup.down('#optionsform').getValues();        
        this.setValue(this.createFieldTextFromSelection());
        this.hideOptionList();
    },

    hideOptionList: function () {
        RM.ViewMgr.deRegBackHandler();
        this.popup.hide();        
    },

    getSelectedOptions: function () {
        return this.selectedOptions;
    },

    setSelectedOptions: function (selectedOpts) {
        this.selectedOptions = selectedOpts;
        this.setValue(this.createFieldTextFromSelection());
    },

    createFieldTextFromSelection: function () {
        if (!this.selectedOptions) {
            return '';
        }
        var selectionText = '';
        if (this.config.options && this.config.options.length > 0) {
            this.config.options.forEach(function (item) {
                selectionText += this.selectedOptions[item.value] ? item.text + ', ' : '';
            }, this);
        }
        selectionText = selectionText.trim();
        var commaIndex = selectionText.lastIndexOf(',');
        var selectionTextLength = selectionText.length;
        if (selectionTextLength > 0 && commaIndex === selectionTextLength - 1) {
            selectionText = selectionText.slice(0, commaIndex);
        }
        return selectionText;
    }
});