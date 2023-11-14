export default {
    bookingDialog: {
        titleCreate: 'Create new booking',
        titleUpdate: 'Update booking',
        nameCustomer: 'Name Customer',
        phone: 'Phone',
        arrivalTime: 'Arrival Time',
        numberPeople: 'Number People',
        placeholder: {
            nameCustomer: 'Enter Name Customer',
            phone: 'Enter Phone',
            arrivalTime: 'Select Arrival Time',
            numberPeople: 'Enter Number People',
        },
    },
    button: {
        cancel: 'Cancel',
        submit: 'Submit',
    },
    bookingForm: {
        status: 'Status',
        nameCustomer: 'Name Customer',
        phone: 'Phone',
        arrivalTime: 'Arrival Time',
        numberPeople: 'Number People',
    },
    bookingTable: {
        header: {
            id: 'ID',
            nameCustomer: 'Name Customer',
            phone: 'Phone',
            arrivalTime: 'Arrival Time',
            numberPeople: 'Number People',
            table: 'Table',
            status: 'Status',
            actions: 'Actions',
        },
    },

    filterForm: {
        keyword: 'Keyword',
        status: 'Status',
        sort: {
            createdAt: 'Created at',
            startDate: 'Start date',
            status: 'Status',
        },
        startDate: 'Start date',
        endDate: 'End date',
        to: 'To',
        arrivalTimeRange: 'Start date',
    },

    status: {
        all: 'All',
        done: 'Done',
        canceled: 'Canceled',
        waiting: 'Waiting',
        waiting_for_approve: 'Waiting for Approve',
    },

    placeholder: {
        keyword: 'Enter keyword',
        status: 'Select status',
        startDate: 'Select the start date',
        endDate: 'Select the end date',
        nameCustomer: 'Name Customer',
        phone: 'Phone',
        arrivalTime: 'Arrival Time',
        numberPeople: 'Number People',
    },

    tooltip: {
        edit: 'Edit',
        confirm: "Confirm customer's booking",
        done: 'Customer has arrived',
        canceled: 'Customer cancels booking',
    },

    message: {
        title: 'Notification',
        create: {
            success: 'Create booking successfully!',
        },

        update: {
            success: 'Update booking successfully!',
        },

        approve: {
            confirmAsk: 'Are you sure you want to approve this booking?',
        },

        complete: {
            confirmAsk: 'Are you sure you want to complete this booking?',
        },

        canceled: {
            confirmAsk: 'Are you sure you want to canceled this booking?',
        },

        waitConfirm: {
            title: 'Notification',
            message:
                'Create booking successfully! We will confirm your table reservation and get back to you in a few minutes.',
        },

        button: {
            cancel: 'Cancel',
            confirm: 'Confirm',
        },
    },

    pageName: 'Booking management',
};
