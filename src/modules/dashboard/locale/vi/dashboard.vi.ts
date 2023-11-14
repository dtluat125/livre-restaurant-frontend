export default {
    pageName: 'Thống kê',

    statisticalData: {
        billingCount: 'Sô lượng hóa đơn trong tháng',
        revenueTotal: 'Doanh thu trong tháng',
    },

    StatisticalChart: {
        dateRangeType: {
            day: 'Ngày',
            month: 'Tháng',
        },

        filterForm: {
            revenue: {
                dateRangeType: {
                    label: 'Thống kê theo',
                    placeholder: 'Chọn kiểu thống kê',
                },
                dateRange: {
                    label: 'Thời gian',
                    placeholder: 'Chọn thời gian',
                },
            },
        },
        chart: {
            revenue: {
                label: 'Thống kê doanh thu',
                line: 'Doanh thu',
            },
        },
    },
};
