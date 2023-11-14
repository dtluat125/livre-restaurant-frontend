// layouts
export const MAIN_LAYOUT_NAME = 'MainLayout';
export const GUEST_LAYOUT_NAME = 'GuestLayout';
export const LOGIN_LAYOUT_NAME = 'LoginLayout';
export const ERROR_LAYOUT_NAME = 'ErrorLayout';
export const VAT_TAX_RATE = 0.08;

export const INPUT_MONEY_MIN_VALUE = 0;

// max size upload file 10 * 1024 * 1024 = 10485760
export const MAX_SIZE_FILE = 10485760;

export const SidebarWidth = {
    expand: '230px',
    collapse: '80px',
};

export const INTEGER_ALLOW_CODES = [
    // Character 0-9  in Numpad
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',

    // Character 0-9
    'Digit0',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',

    // Character control
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
];

export const DECIMAL_ALLOW_CODES = [
    // Character 0-9  in Numpad
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',

    // Character 0-9
    'Digit0',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',

    // Character decimal
    'NumpadDecimal',
    'Period',

    // Character control
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
];

// textarea
export const TEXTAREA_DEFAULT_ROWS = 3;
export const TEXTAREA_MAX_ROW = 10;
export const TEXTAREA_MIN_ROW = 1;
export const INPUT_TEXT_MAX_LENGTH = 255;
export const INPUT_NUMBER_MAX_VALUE = 4294967295;
export const INPUT_URL_MAX_LENGTH = 2500;
export const TEXTAREA_MAX_LENGTH = 2000;
export const MAX_LENGTH_DAYS_OF_MONTH = 31;
export const DEFAULT_ROWS_TEXTAREA = 3;

export const MAX_LENGTH_MONTH = 12;

export const MAX_PHONE_NUMBER_LENGTH = 11;
export const MIN_PHONE_NUMBER_LENGTH = 10;
// pagination
export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_MAX_SIZE_PER_PAGE = 1000;
export const DEFAULT_SIZE_PER_PAGE = 10;
export const DEFAULT_SIZE_PER_PAGE_OPTIONS = [10, 50, 100];
export const DEFAULT_LAYOUT = 'prev, pager, next';
export const DEFAULT_PAGER_COUNT = 7;

export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    ITEM_NOT_FOUND = 444,
    ITEM_ALREADY_EXIST = 445,
    ITEM_IS_USING = 446,
    ITEM_IS_INVALID = 448,
    INTERNAL_SERVER_ERROR = 500,
}

export enum PageName {
    LOGIN_PAGE = 'LoginPage',
    DASHBOARD_PAGE = 'DashboardPage',
    PROFILE_PAGE = 'ProfilePage',
    USER_PAGE = 'UserPage',
    ROLE_LIST_PAGE = 'RoleListPage',
    BILLING_PAGE = 'BillingPage',
    NOT_FOUND_PAGE = 'NotFoundPage',
    SETTINGS_POSITION_PAGE = 'SettingsPositionPage',

    TABLE_DIAGRAM_PAGE = 'TableDiagramPage',
    BOOKING_PAGE = 'BookingPage',
    MENU_FOOD_PAGE = 'FoodPage',
    MENU_CATEGORY_PAGE = 'CategoryPage',
    PAYMENT_PAGE = 'PaymentPage',
    RECEIPT_PAGE = 'ReceiptPage',
    PROMOTION_PAGE = 'PromotionPage',
    REPORT_REPORT_REVENUE_PAGE = 'ReportReportRevenuePage',
    CHEF_PAGE = 'chefPage',
    GUEST_PAGE = 'guestPage',
}

export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export const Order = {
    ASC: {
        value: OrderDirection.ASC,
        label: 'Z - A',
    },
    DESC: {
        value: OrderDirection.DESC,
        label: 'A - Z',
    },
};

export interface IELColumnSort {
    prop: string;
    order: OrderDirection;
}
// eslint-disable-next-line no-useless-escape
export const MIN_DATE_PICKER = '1800-01-01 00:00:00';

export const USER_LIMIT = 1000;

export enum SupportLanguage {
    EN = 'en',
    VI = 'vi',
}
export const DEFAULT_ORDER_BY = 'createdAt';
export const DEFAULT_ORDER_DIRECTION = OrderDirection.DESC;

export const SIDEBAR_ARRAY = ['asset', 'requestAsset', 'user', 'timekeeping', 'role'];

export enum ModuleName {
    DASHBOARD = 'dashboard',
    USER = 'user',
    TABLE_DIAGRAM = 'tableDiagram',
    BOOKING = 'booking',
    MENU_FOOD = 'food',
    MENU_CATEGORY = 'category',
    STORE_MATERIAL = 'storeMaterial',
    STORE_CONVERT = 'storeConvert',
    STORE_SUPPLIER = 'storeSupplier',
    STORE_IMPORT_MATERIAL = 'storeImportMaterial',
    STORE_IMPORT_MATERIAL_DETAIL = 'storeImportMaterialDetail',
    STORE_EXPORT = 'storeExport',
    STORE_EXPORT_MATERIAL_DETAIL = 'storeExportMaterialDetail',
    STORE_CHECK_INVENTORY = 'storeCheckInventory',
    STORE_INVENTORY_DETAIL = 'storeInventoryDetail',
    BILLING = 'billing',
    REPORT_REVENUE = 'reportRevenue',
    ROLE = 'role',
    CHEF = 'chef',
}

export enum SpecialPage {
    PROFILE_PAGE = 'profile',
    NOT_FOUND = '404',
}

export const timezone = 'Asia/Ho_Chi_Minh';

export const REGEX = {
    URL: /^https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/,
    EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,20}$/,
    PHONE_NUMBER: /^([0-9]){10,11}$/,
    FOLDER_PATH: /^.*[\\/]/,
    YYYY_MM_DD_HYPHEN: /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
    YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON:
        /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/,
    YYYY_MM_DD_HYPHEN_HH_MM_COLON:
        /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/,
    NUMBER: /^[0-9]/,
};

export const LIMIT_PER_PAGE = 10;

export const IMAGE_ACCEPTED_FILE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
];

export const EXCEL_ACCEPTED_FILE_TYPES = ['xls', 'xlsx', 'csv'];

export enum KEY_CODES {
    E = 69,
    EQUAL = 187,
    DASH = 189,
    PERIOD = 190,
    ENTER = 13,
}

export enum KEYBOARD_EVENT_CODE {
    E = 'KeyE',
    EQUAL = 'Equal',
    DASH = 'Minus',
    PERIOD = 'Period',
    ENTER = 'Enter',
}

export enum CONFIRM_POPUP_RESULT {
    CONFIRM = 'confirm',
    CLOSE = 'close',
    CANCEL = 'cancel',
}

export enum BadgeStatuses {
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger',
}

export enum WeekDay {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 0,
}

export enum DATE_TIME_FORMAT {
    DD = 'DD',
    DAY_NAME_MONTH_STRING = 'dddd (DD-MM)',
    YYYY = 'YYYY',
    YYYY_MM_HYPHEN = 'YYYY-MM',
    YYYY_MM_DD_HYPHEN = 'YYYY-MM-DD',
    HH_MM_SS_COLON = 'HH:mm:ss',
    HH_MM_COLON = 'HH:mm',
    YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON = 'YYYY-MM-DD HH:mm:ss',
    YYYY_MM_DD_HYPHEN_HH_MM_COLON = 'YYYY-MM-DD HH:mm',
    DD_MM_YYYY_SLASH = 'DD/MM/YYYY',
    SENDGRID_DATE_FORMAT = 'HH:mm [ngày] DD/MM/YYYY',
}

export const DEFAULT_MIN_DATE = '2018-09-09';

export enum WITH_DELETED_OPTION {
    YES = 1,
    NO = 0,
}
export enum WITH_INACTIVE_OPTION {
    YES = 1,
    NO = 0,
}
export const MAX_INTEGER = 4294967295;
export enum ConfirmBoxAction {
    CONFIRM = 'confirm',
    CLOSE = 'close',
    CANCEL = 'cancel',
}
export const I18nConfig = {
    vi: {
        extension: '.vi.ts',
        regex: /vi\.ts$/,
        code: 'vi',
    },
    en: {
        extension: '.en.ts',
        regex: /en\.ts$/,
        code: 'en',
    },
};

export const MAX_FILE_SIZE_IN_BYTE = 2097152; // 2MB = 2097152B

export enum AcceptStatus {
    APPROVE = 'APPROVE',
    JUST_CREATE = 'JUST_CREATE',
    WAITING_APPROVE = 'WAITING_APPROVE',
    REQUEST_CHECK_AGAIN = 'REQUEST_CHECK_AGAIN',
    CHECKED_AGAIN = 'CHECKED_AGAIN',
    REJECT = 'REJECT',
}
