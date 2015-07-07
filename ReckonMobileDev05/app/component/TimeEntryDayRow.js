Ext.define('RM.component.TimeEntryDayRow', {
    extend: 'RM.component.SecureFormPanel',
    xtype: 'timeentrydayrow',    
    config: {
        layout: 'hbox',
        items: [
        {
            xtype: 'extdatepickerfield',
            name: 'Date',            
            dateFormat: 'D jS',
            cls: ['rm-flatfield-disabled-label-look', 'rm-inputel-alignl'],
            //cls: ['rm-flatfield-disabled-label-look'],
            disabled: true,
            placeHolder: 'select',
            width: 120
        },{
            xtype: 'durationfield',
            name: 'Duration',
            cls: 'rm-flatfield',
            placeHolder: '00:00',
            clearIcon: false,
            maxHours: 99,
            flex: 1
        },{
            xtype: 'exttextfield',
            name: 'Notes',
            cls: ['rm-flatfield', 'rm-notesfield', 'rm-notesfield-empty', 'rm-field-border-left'],
            clearIcon: false,
            readOnly: true,
            width: 48 
        },{
            xtype: 'hiddenfield',
            name: 'Status'
        }
        ]
    },    

    initialize: function () {
        this.callParent(arguments);
        var notesField = this.down('[name=Notes]');
        this.toggleNotesFieldState(notesField, notesField.getDisabled());

        notesField.on('tap', function () {
            this.editDescription();
        }, this);
        notesField.on('change', function () {
            this.updateNotesFieldState();
        }, this);
        notesField.on('disabledchange', function (field, value) {
            this.toggleNotesFieldState(field,value);
        }, this);
    },

    toggleNotesFieldState: function(field, value) {
        value ? field.addCls(['rm-notesfield-disabled']) : field.removeCls(['rm-notesfield-disabled']);
    },

    isEditable: function () {
        return RM.PermissionsMgr.canAddEdit('Timesheets');
    },

    editDescription: function () {
        var editable = this.isEditable();
        RM.Selectors.showNoteText(
            'Notes',
            editable,
            'SAVE',
            this.noteText,
            function (noteText) {
                RM.ViewMgr.back();
                this.noteText = noteText; 
                this.down('[name=Notes]').setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );
    },

    updateNotesFieldState: function () {
        var notesField = this.down('[name=Notes]');
        this.noteText = notesField.getValue();
        if (notesField.getValue()) {
            notesField.setCls(['rm-flatfield', 'rm-notesfield', 'rm-notesfield-nonempty', 'rm-field-border-left']);
        }
        else {
            notesField.setCls(['rm-flatfield', 'rm-notesfield', 'rm-notesfield-empty', 'rm-field-border-left']);
        }
    }

});