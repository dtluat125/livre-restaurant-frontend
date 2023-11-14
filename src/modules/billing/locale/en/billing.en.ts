export default {
    updateTitle: 'Update billing',
    detailTitle: 'Detail billing',

    billingTable: {
        customerName: 'Customer name',
        customerPhone: 'Customer phone',
        table: 'Table',
        paymentTotal: 'Total billing price',
        paymentTime: 'Payment time',
        billingStatus: 'Billing status',
        action: 'Actions',
    },
    billingForm: {
        nameCustomer: 'Name Customer',
        phone: 'Phone',
        paymentTime: 'Pay Date',
        vat: 'VAT (8%) :',
        paymentMethod: 'Payment Method',
        statusBilling: 'Status Billing',
        promotion: 'Promotion :',
        note: 'Note',
        total: 'Total :',
        totalBillingPrice: 'Total Billing Price :',
        cashier: 'Cashier',
    },
    foodBillingTable: {
        food: 'Food',
        price: 'Price',
        quantity: 'Quantity',
        total: 'Total',
    },
    placeholder: {
        nameCustomer: 'Enter customer name',
        phone: 'Enter phone',
        note: 'Enter Note',
    },
    button: {
        clickHere: 'Click here',
        create: 'Create',
        cancel: 'Cancel',
        submit: 'Submit',
    },

    title: 'Billing Management',
    message: {
        createSuccess: 'Create billing successfully!',
        updateSuccess: 'Update billing successfully!',
        deleteBilling: 'Are you sure you want to delete this billing ?',
        deleteBillingTitle: 'Delete billing',
        deleteSuccess: 'Delete billing successfully!',
    },
    tooltip: {
        edit: 'Edit',
        delete: 'Delete',
    },
    filterForm: {
        createdAt: 'Created at',
        name: 'Name',
        keyword: {
            label: 'Keyword',
            placeholder: 'Enter keyword',
        },
        payer: {
            label: 'Payer',
            placeholder: 'Select payers',
        },
        paymentDateRange: {
            label: 'Payment Date Range',
            to: 'To',
            startDate: 'Start date',
            endDate: 'End date',
        },
    },

    statusBillingOptions: {
        eating: 'Customer having meal',
        canceled: 'Canceled',
        wait_for_pay: 'Wait For Pay',
        paid: 'Paid',
        wait_for_select_food: 'Wait for select food',
    },

    paymentMethodOptions: {
        banking: 'Banking',
        ready_cash: 'Ready Cash',
    },
};
