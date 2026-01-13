const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    dynamicsList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    isEmpty: false
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

    this.loadMyDynamics();
  },

  onPullDownRefresh() {
    this.refreshDynamics();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadMyDynamics(true);
    }
  },

  // 刷新动态列表
  refreshDynamics() {
    this.setData({
      page: 1,
      dynamicsList: [],
      hasMore: true
    });
    this.loadMyDynamics(false, true);
  },

  // 加载我的动态
  async loadMyDynamics(isLoadMore = false, isPullRefresh = false) {
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

      const result = await request.callFunction('getUserDynamics', {
        userId: stored.openid,
        page: this.data.page,
        pageSize: this.data.pageSize
      }, {
        showLoad: !isLoadMore && !isPullRefresh
      });

      const newList = this.data.page === 1 ? result.list : [...this.data.dynamicsList, ...result.list];

      this.setData({
        dynamicsList: newList,
        hasMore: result.hasMore,
        loading: false,
        isEmpty: newList.length === 0
      });

      if (isPullRefresh) {
        wx.stopPullDownRefresh();
      }
    } catch (error) {
      console.error('加载我的动态失败:', error);
      this.setData({
        loading: false,
        isEmpty: this.data.dynamicsList.length === 0
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

  // 删除动态
  onDeleteDynamic(e) {
    const id = e.detail.id;

    wx.showModal({
      title: '提示',
      content: '确定要删除这条动态吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await request.callFunction('deleteDynamic', {
              dynamicId: id
            }, {
              showLoad: true
            });

            request.showToast('删除成功', 'success');

            // 刷新列表
            this.refreshDynamics();
          } catch (error) {
            console.error('删除动态失败:', error);
          }
        }
      }
    });
  },

  // 点赞
  onDynamicLike(e) {
    const { id, isLiked, likesCount } = e.detail;
    const index = this.data.dynamicsList.findIndex(item => item._id === id);

    if (index !== -1) {
      this.setData({
        [`dynamicsList[${index}].isLiked`]: isLiked,
        [`dynamicsList[${index}].likesCount`]: likesCount
      });
    }
  },

  // 评论
  onDynamicComment(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${id}`
    });
  },

  // 前往发布页
  goToPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    });
  }
});
