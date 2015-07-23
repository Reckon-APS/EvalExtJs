Ext.define('RM.core.Consts',{
    alternateClassName: 'RM.Consts',
    singleton : true,
    
    App: {VERSION: 0.001, CORDOVA_CONTAINER: 1, WEB_CONTAINER: 2},
    Api: {TIME_OUT: 60000, STORE_LOAD_TIME_OUT: 60000, VERSION: 1.7},
    Log: {UPLOAD_KEY: 'rmey467rt'},
    Events: {OP: 5, ERROR_GEN: 1000, ERROR_COMMS: 2000},
    //ItemTypes: {CHARGEABLE_ITEM: 1, EXPENSE: 3, TIME: 6 },
    ItemTypes: { CHARGEABLE_ITEM: 1, TIME: 2, EXPENSE: 3 },
    ChargeableItemTypes: {UNKNOWN: 0, PRODUCT: 1, SERVICE: 2},
    HistoryTypes: {INVOICE: 1, TIME: 6, EXPENSE: 7},
    HistoryItemTypes: {NOTE: 5},
    ItemStatus: {UNKNOWN: 0, ACTIVE: 1, INACTIVE: 2},
    //HistoryAdded = 1,  HistoryDeleted=2,  HistoryEdited=3, HistoryStatusChanged=4, Note = 5
    PaymentMethodTypes: { CASH: 0, CHEQUE: 1, CREDIT_CARD: 2 },
    TaxStatus: {UNKNOWN: 0, NON_TAXED: 1, INCLUSIVE: 2, EXCLUSIVE: 3},
    InvoiceStatus: {UNKNOWN: 0, DRAFT: 1, APPROVED: 2, PAID: 3},
    TimeSheetStatus: {UNKNOWN: 0, NON_BILLABLE: 1, UNBILLED: 2, INVOICED: 3, BILLED: 4},
    DocTemplates: {INVOICE: 1, ESTIMATE: 2, CREDIT_NOTE: 3},
    NoAccessMsg: 'No access rights',
    EmptyGuid: '00000000-0000-0000-0000-000000000000'
});