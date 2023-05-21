const appConfig = {
  portServer: process.env.PORT_SERVER || 'http://localhost:8000',
  baseURL: process.env.REACT_APP_API_URL,
  signIn: '/auth/login',
  refreshToken: '/auth/refresh',
  post: '/post',
  postByUser: '/post/byUser',
  getAllPost: '/post/get',
  getFirstPost: '/post/firstPost',
  getCountLikeAndComment: '/post/count',
  apiComment: '/comment',
  apiUpdateComment: '/comment/update',
  getAllComment: '/comment/get',
  getFirstComment: '/comment/firstComment',
  like: '/like',
  getMatches: '/match/matched',
  friends: 'match/friends',
  getMessage: '/message',
  sentMessage: '/message/sent-message',
  profile: '/profile',
  updateProfile: '/profile/update',
  limitPost: 1,
  limitMatch: 1,
  limitMessage: 20,
  businessModels: [
    {
      id: 1,
      label: 'Bất động sản',
      isChecked: false,
    },
    {
      id: 2,
      label: 'Kinh doanh buôn bán',
      isChecked: false,
    },
    {
      id: 3,
      label: 'Công nghệ thông tin',
      isChecked: false,
    },
    {
      id: 4,
      label: 'Chế biến thực phẩm',
      isChecked: false,
    },
    {
      id: 5,
      label: 'Kiến trúc, nghệ thuật',
      isChecked: false,
    },
    {
      id: 6,
      label: 'Kinh tế, tài chính',
      isChecked: false,
    },
    {
      id: 7,
      label: 'Freelancer',
      isChecked: false,
    },
    {
      id: 8,
      label: 'Bán lẻ, phân phối',
      isChecked: false,
    },
    {
      id: 9,
      label: 'Bảo hiểm',
      isChecked: false,
    },
    {
      id: 10,
      label: 'Kinh doanh dịch vụ',
      isChecked: false,
    },
    {
      id: 11,
      label: 'Lĩnh vực nông nghệp',
      isChecked: false,
    },
    {
      id: 12,
      label: 'Kinh doanh sản xuất',
      isChecked: false,
    },
    {
      id: 13,
      label: 'Kinh doanh online',
      isChecked: false,
    },
    {
      id: 14,
      label: 'Kinh doanh điện tử',
      isChecked: false,
    },
    {
      id: 15,
      label: 'Khác',
      isChecked: false,
    },
  ],
  purpose: [
    {
      id: 1,
      label: 'Tìm khách hàng',
      isChecked: false,
    },
    {
      id: 2,
      label: 'Kết bạn kinh doanh',
      isChecked: false,
    },
    {
      id: 3,
      label: 'Liên kết kinh doanh',
      isChecked: false,
    },
    {
      id: 4,
      label: 'Giao lưu học hỏi lĩnh vực khác',
      isChecked: false,
    },
    {
      id: 5,
      label: 'Chia sẻ thông tin',
      isChecked: false,
    },
    {
      id: 6,
      label: 'Nhậu',
      isChecked: false,
    },
    {
      id: 7,
      label: 'Khác',
      isChecked: false,
    },
  ],
};

export default appConfig;
