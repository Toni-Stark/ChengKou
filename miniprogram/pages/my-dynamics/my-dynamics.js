const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');
const util = require('../../utils/util.js');

Page({
  data: {
    dynamicsList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    isEmpty: false,
    errorType: '',
    userInfo: null,
    isShow: true,
    youLongShow: 1
  },

  onLoad() {
    this.loadYouLongShow();

    if (!auth.checkLogin()) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => wx.navigateBack()
      });
      return;
    }

    this.loadUserInfo();
    this.loadDynamics();
  },

  onShow() {
    if (wx.getStorageSync('_needRefresh')) {
      wx.removeStorageSync('_needRefresh');
      this.refreshDynamics();
    }
  },

  onPullDownRefresh() {
    this.refreshDynamics();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadDynamics(true);
    }
  },

  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({ userInfo, isShow: true });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  async loadYouLongShow() {
    try {
      const result = await request.callFunction('getGlobalConfig', {
        key: 'youLongShow'
      }, { showLoad: false, showError: false });
      const val = result && result.value !== undefined ? Number(result.value) : 1;
      this.setData({ youLongShow: val });
    } catch (e) {
      this.setData({ youLongShow: 1 });
    }
  },

  refreshDynamics() {
    this.setData({ page: 1, dynamicsList: [], hasMore: true });
    this.loadDynamics(false, true);
  },

  async loadDynamics(isLoadMore = false, isPullRefresh = false) {
    if (this.data.loading) return;
    this.setData({ loading: true, errorType: '' });

    try {
      if (!wx.cloud || !wx.cloud.callFunction) {
        console.warn('云开发未配置');
        this.setData({
          loading: false,
          isEmpty: this.data.dynamicsList.length === 0,
          errorType: 'cloud'
        });
        return;
      }

      const result = await request.callFunction('getUserDynamics', {
        myOwn: true,
        page: this.data.page,
        pageSize: this.data.pageSize
      }, {
        showLoad: !isLoadMore && !isPullRefresh
      });

      const processedList = await request.processDynamicsImages(result.list);
      const formattedList = processedList.map(item => ({
        ...item,
        displayTime: util.formatRelativeTime(item.createTime)
      }));
      const newList = this.data.page === 1
        ? formattedList
        : [...this.data.dynamicsList, ...formattedList];

      this.setData({
        dynamicsList: newList,
        hasMore: result.hasMore,
        loading: false,
        isEmpty: newList.length === 0,
        errorType: ''
      });
    } catch (error) {
      console.error('加载我的动态失败:', error);
      this.setData({
        loading: false,
        isEmpty: this.data.dynamicsList.length === 0,
        errorType: 'network'
      });
    } finally {
      if (isPullRefresh) {
        wx.stopPullDownRefresh();
      }
    }
  },

  onDynamicTap(e) {
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${e.currentTarget.dataset.id}`
    });
  },

  onEditDynamic(e) {
    wx.navigateTo({
      url: `/pages/edit-dynamic/edit-dynamic?id=${e.detail.id}`
    });
  },

  onDynamicSubscribe(e) {
    const { id, isSubscribed } = e.detail;
    const index = this.data.dynamicsList.findIndex(item => item._id === id);
    if (index !== -1) {
      this.setData({ [`dynamicsList[${index}].isSubscribed`]: isSubscribed });
    }
  },

  onDynamicComment(e) {
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${e.detail.id}`
    });
  },

  goToPublish() {
    wx.navigateTo({ url: '/pages/publish/publish' });
  }
});
