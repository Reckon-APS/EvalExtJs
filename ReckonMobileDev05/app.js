
Ext.application({    
    name: 'RM',
    requires: ['RM.core.Consts', 'RM.util.Log', 'RM.component.RMComponent'],
    controllers: ['MainC', 'TestScreenC', 'CoreSettingsC', 'AppStopC', 'ModulesC', 'ModuleSignupC', 'AboutC', 'ContactsC', 'ContactDetailC', 'MyPreferencesC', 'EnterPinC', 'EnterUsernameC', 'CreatePinC', 'CashBooksC', 'CustomersC', 'BudgetLineItemsC', 'BillsC', 'ItemsC', 'DashboardC', 'ForgotPasswordC', 'CustomerInvoicesC', 'InvoicesC', 'InvoiceDetailC', 'InvoiceLineItemC', 'InvoiceItemSelectC', 'InvoiceTimeSelectC', 'InvoiceExpenseSelectC', 'InvoiceTimeSelectDetailC', 'InvoiceBalanceBreakdownC', 'InvoiceActionsC', 'HistoryC', 'CustomDiscountC', 'TimeSheetsC', 'SelectWeekC', 'TimeSheetWeeklyC', 'TimeSheetDetailC', 'ExpenseDetailC', 'ExpensesC', 'ProjectsC', 'SuppliersC', 'EmailInvoiceC', 'AddNoteC', 'ItemsAmountsC', 'ItemDetailC', 'CreateItemC', 'AcceptPaymentC', 'ReceiptPhotoPreviewC', 'PayAmountInputC', 'PayTransTypeSelectC', 'PayAmountDetailsC', 'PaySalesHistoryC', 'PayRecvCashC', 'PayRecvChequeC', 'PayRecvManualCardC', 'PaySendReceiptC', 'PayTransTerminalC', 'PayTransDetailsC', 'PayTransRefundC', 'PayPreferencesC', 'PayAmountInputBackC', 'PayAmountInputNavC', 'PayTransCardSignC', 'PinAuthenticationC', 'AccountsC'],
    models: ['GSTCode', 'ItemType', 'AccountingCategory', 'TaxStatus', 'CashBook', 'Bill', 'Item', 'BudgetLineItem', 'CustomerInvoice', 'Customer', 'Contact', 'Invoice', 'InvoiceTemplate', 'InvoiceTimeSelect', 'InvoiceExpenseSelect', 'TimeEntry', 'TimeEntryCalendar', 'Expense', 'Project', 'Supplier', 'History', 'PaymentMethod', 'BankAccount', 'Transaction', 'CardType', 'TransactionMethod', 'Term'],
    stores: ['GSTCodes', 'ItemTypes', 'AccountingCategories', 'TaxStatuses', 'CashBooks', 'Bills', 'Items', 'BudgetLineItems', 'CustomerInvoices', 'Customers', 'Contacts', 'Invoices', 'InvoiceTemplates', 'InvoiceTimeSelect', 'InvoiceExpenseSelect', 'TimeEntries', 'TimeEntriesCalendar', 'Expenses', 'Projects', 'Suppliers', 'Histories', 'PaymentMethods', 'BankAccounts', 'Transactions', 'CardTypes', 'TransactionMethods', 'Terms'],
    launch: function () {

    }
    
});


