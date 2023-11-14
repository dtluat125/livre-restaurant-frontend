import { ModuleName } from '@/common/constants';

export default {
    pageName: {
        listPage: 'Role management',
        roleList: 'Roles list',
        roleInfo: 'Role Information',
    },
    table: {
        name: 'Name',
        actions: 'Actions',
        tooltip: {
            edit: 'Edit',
            delete: 'Delete',
        },
    },
    filterForm: {
        title: 'Search by:',
        keyword: {
            label: 'Keyword',
            placeholder: 'Enter keyword',
        },
        search: 'Search',
    },
    sort: {
        label: 'Sort by',
        placeholder: 'Select a field',
        name: 'Name',
        createdAt: 'Created at',
    },
    confirmDelete: {
        deleteConfirmText:
            'Are you sure you want to delete this role? This action cannot be undone.',
        deleteConfirmTitle: 'Delete Role',
        success: {
            title: 'Success',
            message: 'Delete role completed!',
        },
        error: {
            title: 'Error',
            message: 'Delete role failed!',
        },
    },
    form: {
        name: {
            label: 'Role name',
            placeholder: 'Enter role name',
        },
        permission: {
            label: 'Permissions list',
        },
        saveButton: 'Save',
        backButton: 'Back',
    },
    button: {
        create: 'Create',
    },
    editPage: {
        notification: {
            updateSuccess: {
                title: 'Success',
                message: 'You have updated successfully',
            },
        },
    },
    createPage: {
        title: 'Create New Role',
        btnCancel: 'Cancel',
        btnSave: 'Save',
        inputLabelName: 'Role name',
        description: 'Description',
        checkBoxLabelName: 'User has permission to login',
        errorMessage: {
            inputEmpty: 'Input must be fill',
        },
        placeholder: {
            name: 'Input role name',
            description: 'Input role description',
        },
        notification: {
            createSuccess: {
                title: 'Success',
                message: 'You have created successfully!',
            },
            createFail: {
                title: 'Fail',
                message: 'You have created fail!',
            },
        },
    },
    common: {
        headerTable: {
            name: 'Module name',
            all: 'All',
            create: 'Create',
            createPersonal: 'Create personal',
            read: 'Read',
            readPersonal: 'Read personal',
            update: 'Update',
            updatePersonal: 'Update personal',
            delete: 'Delete',
            deletePersonal: 'Delete personal',
            updateStatus: 'Update status',
            updateRole: 'Update role',
            convertMaterial: 'Convert material',
            approveStatus: 'Approve status',
            approve: 'Approve',
            login: 'User can login',
            action: 'Action',
            allow: 'Allow',
            upload: 'Upload',
            reject: 'Reject',
            editEmail: 'Edit email',
            sendEmail: 'Send email',
            createPast: 'Create request past',
            module: {
                [ModuleName.DASHBOARD]: 'Dashboard',
                [ModuleName.USER]: 'User',
                [ModuleName.TABLE_DIAGRAM]: 'Table Diagram',
                [ModuleName.BOOKING]: 'Booking',
                [ModuleName.MENU_FOOD]: 'Food',
                [ModuleName.MENU_CATEGORY]: 'Category',
                [ModuleName.BILLING]: 'Billing',
                [ModuleName.REPORT_REVENUE]: 'Report Revenue',
                [ModuleName.ROLE]: 'Role',
            },
        },
        error: {
            noPermission: 'The role needs at least one permission',
        },
    },
};
