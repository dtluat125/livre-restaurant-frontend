export default {
    pageName: ' Quản lý người dùng',
    filterForm: {
        title: 'Quản lí người dùng',
        createUser: 'Tạo',
        search: 'Tìm kiếm',
        emptyMessage: 'Không có dữ liệu',
        note: {
            label: 'Ghi chú',
            placeholder: 'Nhập vào đây',
        },
        role: {
            label: 'Vai trò',
            placeholder: 'Chọn vai trò',
            member: 'Thành viên',
            supervisor: 'Giám sát viên',
            admin: 'Quản trị viên',
        },
        status: {
            label: 'Trạng thái',
            placeholder: 'Chọn trạng thái',
            waiting_for_approval: 'Chờ phê duyệt',
            active: 'Hoạt động',
            inactive: 'Dừng hoạt động',
        },
        gender: {
            label: 'Giới tính',
            placeholder: 'Chọn giới tính',
            male: 'Nam',
            female: 'Nữ',
            other: 'Khác',
        },
        position: {
            label: 'Vị trí',
            placeholder: 'Chọn vị trí',
            developer: 'Lập trình viên',
            tester: 'Kiểm thử viên',
            admin: 'Quản trị viên',
            accounting: 'Kế toán',
        },
        province: {
            label: 'Tỉnh',
            placeholder: 'Chọn tỉnh',
        },
        keyword: {
            label: 'Từ khóa',
            placeholder: 'Nhập từ khóa',
        },
        sort: {
            title: 'Sort by',
            label: 'Sắp xếp',
            placeholder: 'Chọn trường để sắp xếp',
            fullName: 'Tên',
            status: 'Trạng thái',
            createdAt: 'Ngày tạo',
        },
    },
    userTable: {
        action: {
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            status: 'Chỉnh sửa trạng thái',
        },
    },
    pagination: {
        totalItems: 'Tổng {totalItems} người dùng',
    },
    updateStatus: {
        confirmPopup: {
            title: 'Cập nhật trạng thái',
            message: 'Bạn có muốn {action} người dùng không?',
            active: 'kích hoạt',
            inactive: 'tạm dừng',
        },
        notification: {
            title: 'Thông báo',
            messageSuccess: 'Cập nhật trạng thái thành công!',
        },
    },
    deleteUser: {
        confirmPopup: {
            title: 'Xóa người dùng',
            message: 'Bạn có chắc muốn xóa người dùng này không?',
        },
        notification: {
            title: 'Thông báo',
            messageSuccess: 'Xóa người dùng thành công!',
        },
    },
    menuAction: {
        removeUser: 'Xóa người dùng',
    },
    upload: {
        uploadUser: 'Tải tệp người dùng',
        uploadFinger: 'Tải tệp vân tay',
    },
};
