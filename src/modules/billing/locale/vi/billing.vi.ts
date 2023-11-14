export default {
    updateTitle: 'Chỉnh sửa hóa đơn',
    detailTitle: 'Chi tiết hóa đơn',

    billingTable: {
        customerName: 'Tên khách hàng',
        customerPhone: 'Số điện thoại',
        paymentTotal: 'Tổng thanh toán',
        table: 'Bàn',
        paymentTime: 'Ngày thanh toán',
        billingStatus: 'Trạng thái hóa đơn',
        action: 'Hành động',
    },
    billingForm: {
        nameCustomer: 'Tên khách hàng',
        phone: 'Số điện thoại',
        paymentTime: 'Ngày thanh toán',
        vat: 'VAT (8%) :',
        paymentMethod: 'Hình thức thanh toán',
        statusBilling: 'Trạng thái hóa đơn',
        promotion: 'Khuyến mại :',
        note: 'Ghi chú',
        total: 'Tổng :',
        totalBillingPrice: 'Tổng thanh toán :',
        cashier: 'Nhân viên thu ngân',
    },
    foodBillingTable: {
        food: 'Món ăn',
        price: 'Giá',
        quantity: 'Số lượng',
        total: 'Tổng',
    },
    placeholder: {
        nameCustomer: 'Nhập tên khách hàng',
        phone: 'Nhập số điện thoại',
    },
    button: {
        clickHere: 'Nhấn để xem',
        create: 'Tạo',
        cancel: 'Hủy',
        submit: 'Xác nhận',
    },

    title: ' Quản lý hóa đơn',
    message: {
        createSuccess: 'Tạo hoá đơn thành công!',
        updateSuccess: 'Cập nhật hoá đơn thành công!',
        deleteBilling: 'Bạn có chắc chắn muốn xóa hóa đơn này không?',
        deleteBillingTitle: 'Xóa hóa đơn',
        deleteSuccess: 'Xóa hóa đơn thành công!',
    },
    tooltip: {
        edit: 'Chỉnh sửa',
        delete: 'Xóa',
    },
    filterForm: {
        createdAt: 'Ngày tạo',
        name: 'Tên',
        keyword: {
            label: 'Từ khóa',
            placeholder: 'Nhập từ khóa',
        },
        payer: {
            label: 'Người thanh toán',
            placeholder: 'Chọn người thanh toán',
        },
        paymentDateRange: {
            label: 'Phạm vi ngày thanh toán',
            to: 'Đến',
            startDate: 'Ngày bắt đầu',
            endDate: 'Ngày kết thúc',
        },
    },
    statusBillingOptions: {
        eating: 'Khách đang dùng bữa',
        canceled: 'Hủy',
        waitForPay: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        wait_for_select_food: 'Chờ gọi món',
    },
    paymentMethodOptions: {
        banking: 'Chuyển khoản',
        ready_cash: 'Tiền mặt',
    },
};
