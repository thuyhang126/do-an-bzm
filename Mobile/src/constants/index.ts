export const APP = {
  ENV: 'dev',
  IOS: 'ios',
  ANDROID: 'android',
  LANG: 'ja',
  POLICY_URL: 'l',
  NEXT_MATCHING_HOURS: 12,
};

export const API = {
  WS_URL: '',
  API_BASE_URL: '',
  LOGIN: '/auth/login',
  TOKEN_REFRESH: '/auth/refresh',
  USER_PROFILE: '/profile',
  USER_PROFILE_UPDATE: '/profile/update',
  USER_REF_CODE: '/profile/code',
  USER_DELETE: '/profile/deletedUser',
  MATCHING_CARDS_DATA: '/match/random',
  MATCHING_INTERACTION: '/interaction/create',
  FRIEND_LIST: '/match/matched',
  CHAT_MESSAGE_LIST: '/message',
};

export const IMAGE = {
  LOGO: require('../images/logo.png'),
  ICON_PLUS: require('../images/icon-plus.png'),
  ICON_EDIT_LAST_MESSAGE: require('../images/icon-edit-last-message.png'),
  ICON_CHECK: require('../images/icon-check.png'),
  ICON_CLOSE: require('../images/icon-close.png'),
  ICON_LOADING: require('../images/icon-loading.png'),
  ICON_CHEVRON_LEFT: require('../images/icon-chevron-left.png'),
  ICON_APPLE: require('../images/icon-apple.png'),
  ICON_GMAIL: require('../images/icon-gmail.png'),
  ICON_FACEBOOK: require('../images/icon-facebook.png'),
  ICON_CHEVRON_DOWN: require('../images/icon-chevron-down.png'),
  ICON_CHEVRON_RIGHT: require('../images/icon-chevron-right.png'),
  ICON_CAMERA: require('../images/icon-camera.png'),
  ICON_PHOTO: require('../images/icon-photo.png'),
  ICON_CALENDAR: require('../images/icon-calendar.png'),
  ICON_CLOCK: require('../images/icon-clock.png'),
  ICON_CAMERA_PLUS: require('../images/icon-camera-plus.png'),
  ICON_SETTINGS: require('../images/icon-settings.png'),
  ICON_USER_PLUS: require('../images/icon-user-plus.png'),
  ICON_USER_MUL: require('../images/icon-user-mul.png'),
  ICON_USER_DEL: require('../images/icon-user-del.png'),
  ICON_MESSAGE: require('../images/icon-message.png'),
  ICON_MOON_STAR: require('../images/icon-moon-star.png'),
  ICON_SHIELD_LOCK: require('../images/icon-shield-lock.png'),
  ICON_DOOR_EXIT: require('../images/icon-door-exit.png'),
  ICON_SEARCH: require('../images/icon-search.png'),
  ICON_CIRCLE_CHECK_WHITE: require('../images/icon-circle-check-white.png'),
  ICON_CIRCLE_CHECK: require('../images/icon-circle-check.png'),
  ICON_SEND: require('../images/icon-send.png'),
  ICON_COPY: require('../images/icon-copy.png'),
  AVATAR: require('../images/avatar.png'),
  CARD_VISIT: require('../images/card-visit.png'),
};

export const POSITION = [
  {name: 'Giám đốc', value: 'Giám đốc'},
  {name: 'Quản lý cấp cao', value: 'Quản lý cấp cao'},
  {name: 'Freelance', value: 'Freelance'},
  {name: 'Trưởng nhóm', value: 'Trưởng nhóm'},
  {name: 'Phó giám đốc', value: 'Phó giám đốc'},
  {name: 'Trợ lý giám đốc', value: 'Trợ lý giám đốc'},
  {name: 'Chức vụ khác', value: 'Chức vụ khác'},
];

export const BUSINESS_MODEL = [
  {id: 1, label: 'Bất động sản', isChecked: false},
  {id: 2, label: 'Kinh doanh buôn bán', isChecked: false},
  {id: 3, label: 'Công nghệ thông tin', isChecked: false},
  {id: 4, label: 'Chế biến thực phẩm', isChecked: false},
  {id: 5, label: 'Kiến trúc, nghệ thuật', isChecked: false},
  {id: 6, label: 'Kinh tế, tài chính', isChecked: false},
  {id: 7, label: 'Freelancer', isChecked: false},
  {id: 8, label: 'Bán lẻ, phân phối', isChecked: false},
  {id: 9, label: 'Bảo hiểm', isChecked: false},
  {id: 10, label: 'Kinh doanh dịch vụ', isChecked: false},
  {id: 11, label: 'Lĩnh vực nông nghệp', isChecked: false},
  {id: 12, label: 'Kinh doanh sản xuất', isChecked: false},
  {id: 13, label: 'Kinh doanh online', isChecked: false},
  {id: 14, label: 'Kinh doanh điện tử', isChecked: false},
  {id: 15, label: 'Khác', isChecked: false},
];

export const PURPOSE = [
  {id: 1, label: 'Tìm khách hàng', isChecked: false},
  {id: 2, label: 'Chia sẻ thông tin', isChecked: false},
  {id: 3, label: 'Giao lưu học hỏi', isChecked: false},
  {id: 4, label: 'Kết bạn kinh doanh', isChecked: false},
  {id: 5, label: 'Nhậu', isChecked: false},
  {id: 6, label: 'Liên kết kinh doanh', isChecked: false},
  {id: 7, label: 'Khác', isChecked: false},
];

export const STATE = [
  {name: 'Tôi đang online!', value: 'online'},
  {name: 'Tôi đang offline!', value: 'offline'},
];
