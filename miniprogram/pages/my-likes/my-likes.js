const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    subscriptionsList: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    isEmpty: false,
    userInfo: null,
    viewMode: 'grid',
    deletingOpenid: ''
  },

  onLoad() {
    if (!auth.checkLogin()) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
      return;
    }

    this.loadUserInfo();
    this.loadSubscriptions();
  },

  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({ userInfo: userInfo });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  onPullDownRefresh() {
    this.refreshSubscriptions();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadSubscriptions(true);
    }
  },

  refreshSubscriptions() {
    this.setData({
      page: 1,
      subscriptionsList: [],
      hasMore: true
    });
    this.loadSubscriptions(false, true);
  },

  async loadSubscriptions(isLoadMore = false, isPullRefresh = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const stored = auth.getStoredUserInfo();

      if (!wx.cloud || !wx.cloud.callFunction) {
        wx.showToast({ title: '云开发未配置', icon: 'none' });
        this.setData({ loading: false });
        return;
      }

      const result = await request.callFunction('getMySubscriptions', {
        page: this.data.page,
        pageSize: this.data.pageSize
      }, {
        showLoad: !isLoadMore && !isPullRefresh
      });

      const processedList = result.list || [];
      const newList = this.data.page === 1 ? processedList : [...this.data.subscriptionsList, ...processedList];

      this.setData({
        subscriptionsList: newList,
        hasMore: result.hasMore,
        loading: false,
        isEmpty: newList.length === 0
      });

      if (isPullRefresh) {
        wx.stopPullDownRefresh();
      }
    } catch (error) {
      console.error('加载订阅列表失败:', error);
      this.setData({
        loading: false,
        isEmpty: this.data.subscriptionsList.length === 0
      });

      if (isPullRefresh) {
        wx.stopPullDownRefresh();
      }
    }
  },

  async onUnsubscribe(e) {
    const targetOpenid = e.currentTarget.dataset.openid;

    wx.showModal({
      title: '提示',
      content: '确定取消订阅该用户吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await request.callFunction('subscribeUser', {
              targetOpenid: targetOpenid
            }, { showLoad: true });

            const newList = this.data.subscriptionsList.filter(item => item._openid !== targetOpenid);
            this.setData({
              subscriptionsList: newList,
              isEmpty: newList.length === 0
            });
          } catch (error) {
            console.error('取消订阅失败:', error);
          }
        }
      }
    });
  },

  goToDynamics() {
    wx.switchTab({
      url: '/pages/dynamics/dynamics'
    });
  },

  toggleViewMode() {
    this.setData({
      viewMode: this.data.viewMode === 'grid' ? 'list' : 'grid'
    });
  },

  onUserTap(e) {
    const openid = e.currentTarget.dataset.openid;
    if (openid) {
      wx.navigateTo({
        url: `/pages/user-profile/user-profile?openid=${openid}`
      });
    }
  }
});
