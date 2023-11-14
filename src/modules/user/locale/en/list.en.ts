export default {
    pageName: 'User management',
    filterForm: {
        title: 'User management',
        createUser: 'Create',
        search: 'Search',
        emptyMessage: 'No data',
        note: {
            label: 'Note',
            placeholder: 'Enter a note',
        },
        role: {
            label: 'Role',
            placeholder: 'Select roles',
            member: 'Member',
            supervisor: 'Supervisor',
            admin: 'Admin',
        },
        status: {
            label: 'Status',
            placeholder: 'Select status',
            active: 'Active',
            inactive: 'Inactive',
            waiting_for_approval: 'Waiting for approval',
        },
        gender: {
            label: 'Gender',
            placeholder: 'Select genders',
            male: 'Male',
            female: 'Female',
            other: 'Other',
        },
        position: {
            label: 'Position',
            placeholder: 'Select positions',
            developer: 'Developer',
            tester: 'Tester',
            admin: 'Admin',
            accounting: 'Accounting',
        },
        province: {
            label: 'Province',
            placeholder: 'Select provinces',
        },
        keyword: {
            label: 'Keyword',
            placeholder: 'Enter keyword',
        },
        sort: {
            title: 'Sort by',
            label: 'Sort',
            placeholder: 'Select a field',
            fullName: 'Full name',
            status: 'Status',
            createdAt: 'Created at',
        },
    },
    userTable: {
        action: {
            edit: 'Edit',
            delete: 'Delete',
            status: 'Edit status',
        },
    },
    pagination: {
        totalItems: 'Total {totalItems} users',
    },
    updateStatus: {
        confirmPopup: {
            title: 'Change status',
            message: 'Do you want to {action} the user?',
            active: 'Activate',
            inactive: 'Deactivate',
        },
        notification: {
            title: 'Notification',
            messageSuccess: 'Update status successfully!',
        },
    },
    deleteUser: {
        confirmPopup: {
            title: 'Delete user',
            message: 'Are you sure you want to delete this user?',
        },
        notification: {
            title: 'Notification',
            messageSuccess: 'Delete user successfully!',
        },
    },
    menuAction: {
        removeUser: 'Remove',
    },
    upload: {
        uploadUser: 'Upload user',
        uploadFinger: 'Upload finger scanner',
    },
};
