const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    likesList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    isEmpty: false,
    userInfo: null,
    isShow: true
  },

  onLoad() {
    // 检查登录状态
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
    this.loadMyLikes();
  },

  // 加载用户信息
  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo: userInfo,
          isShow: userInfo.is_show !== false
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  onPullDownRefresh() {
    this.refreshLikes();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadMyLikes(true);
    }
  },

  // 刷新点赞列表
  refreshLikes() {
    this.setData({
      page: 1,
      likesList: [],
      hasMore: true
    });
    this.loadMyLikes(false, true);
  },

  // 加载我的点赞
  async loadMyLikes(isLoadMore = false, isPullRefresh = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const stored = auth.getStoredUserInfo();

      // 检查云开发是否可用
      if (!wx.cloud || !wx.cloud.callFunction) {
        console.warn('云开发未配置');
        wx.showToast({
          title: '云开发未配置',
          icon: 'none'
        });
        this.setData({ loading: false });
        return;
      }

      const result = await request.callFunction('getMyLikes', {
        userId: stored.openid,
        page: this.data.page,
        pageSize: this.data.pageSize
      }, {
        showLoad: !isLoadMore && !isPullRefresh
      });

      const newList = this.data.page === 1 ? result.list : [...this.data.likesList, ...result.list];

      this.setData({
        likesList: newList,
        hasMore: result.hasMore,
        loading: false,
        isEmpty: newList.length === 0
      });

      if (isPullRefresh) {
        wx.stopPullDownRefresh();
      }
    } catch (error) {
      console.error('加载我的点赞失败:', error);
      this.setData({
        loading: false,
        isEmpty: this.data.likesList.length === 0
      });

      if (isPullRefresh) {
        wx.stopPullDownRefresh();
      }
    }
  },

  // 查看动态详情
  onDynamicTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${id}`
    });
  },

  // 点赞
  onDynamicLike(e) {
    const { id, isLiked, likesCount } = e.detail;

    // 如果取消点赞，从列表中移除
    if (!isLiked) {
      const newList = this.data.likesList.filter(item => item._id !== id);
      this.setData({
        likesList: newList,
        isEmpty: newList.length === 0
      });
    } else {
      // 更新点赞数
      const index = this.data.likesList.findIndex(item => item._id === id);
      if (index !== -1) {
        this.setData({
          [`likesList[${index}].isLiked`]: isLiked,
          [`likesList[${index}].likesCount`]: likesCount
        });
      }
    }
  },

  // 评论
  onDynamicComment(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${id}`
    });
  },

  // 前往动态页
  goToDynamics() {
    wx.switchTab({
      url: '/pages/dynamics/dynamics'
    });
  }
});
