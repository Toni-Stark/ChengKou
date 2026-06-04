const request = require('../../utils/request.js');

Page({
  data: {
    userId: '',
    userInfo: null,
    isSelf: false,
    isSubscribed: false,
    dynamicsList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    isEmpty: false
  },

  onLoad(options) {
    const { id } = options;
    if (!id) {
      wx.showToast({ title: '用户不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const myOpenid = wx.getStorageSync('openid');
    this.setData({
      userId: id,
      isSelf: myOpenid === id
    });

    this.loadUserInfo();
    this.loadDynamics();
    this.checkSubscribed();
  },

  async loadUserInfo() {
    try {
      const result = await request.callFunction('getUserInfo', {
        userId: this.data.userId
      }, { showLoad: true });

      if (result) {
        this.setData({ userInfo: result });
      }
    } catch (e) {
      console.error('获取用户信息失败:', e);
      wx.showToast({ title: '用户不存在', icon: 'none' });
    }
  },

  async checkSubscribed() {
    if (this.data.isSelf) return;

    try {
      const result = await request.callFunction('getMySubscriptions', {
        page: 1,
        pageSize: 100
      }, { showLoad: false, showError: false });

      const list = result?.list || [];
      const isSubscribed = list.some(item => item._openid === this.data.userId);
      this.setData({ isSubscribed });
    } catch (e) {
      console.warn('检查订阅状态失败:', e);
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, dynamicsList: [], hasMore: true });
    this.loadUserInfo();
    this.loadDynamics(false, true);
    this.checkSubscribed();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadDynamics(true);
    }
  },

  async loadDynamics(isLoadMore = false, isPullRefresh = false) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    try {
      const result = await request.callFunction('getUserDynamics', {
        userId: this.data.userId,
        page: this.data.page,
        pageSize: this.data.pageSize
      }, { showLoad: !isLoadMore && !isPullRefresh });

      const processedList = await request.processDynamicsImages(result.list);
      const newList = this.data.page === 1 ? processedList : [...this.data.dynamicsList, ...processedList];

      this.setData({
        dynamicsList: newList,
        hasMore: result.hasMore,
        loading: false,
        isEmpty: newList.length === 0
      });

      if (isPullRefresh) wx.stopPullDownRefresh();
    } catch (e) {
      console.error('加载游龙失败:', e);
      this.setData({ loading: false, isEmpty: this.data.dynamicsList.length === 0 });
      if (isPullRefresh) wx.stopPullDownRefresh();
    }
  },

  async onSubscribe() {
    if (this.data.isSelf) return;

    try {
      const result = await request.callFunction('subscribeUser', {
        targetOpenid: this.data.userId
      }, { showLoad: true });

      this.setData({ isSubscribed: result.isSubscribed });
      this.loadUserInfo();
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  onDynamicTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${id}`
    });
  },

  onComment(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${id}`
    });
  },

  onSubscribeEvent(e) {
    this.checkSubscribed();
  }
});
