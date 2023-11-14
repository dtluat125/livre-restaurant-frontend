export default {
    pageName: 'Dashboard',

    statisticalData: {
        billingCount: 'Billing Count in the month',
        revenueTotal: 'Revenue in the month',
    },

    StatisticalChart: {
        dateRangeType: {
            day: 'Day',
            month: 'Month',
        },

        filterForm: {
            revenue: {
                dateRangeType: {
                    label: 'View by',
                    placeholder: 'Select View by',
                },
                dateRange: {
                    label: 'Time',
                    placeholder: 'Select Time',
                },
            },
        },
        chart: {
            revenue: {
                label: 'Revenue statistics',
                line: 'Revenue',
            },
        },
    },
};
