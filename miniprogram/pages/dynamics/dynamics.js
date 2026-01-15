const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    dynamicsList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    openid: null,
    loading: false,
    shareInfo: null // 保存当前要分享的动态信息
  },

  onLoad(options) {
    const { from } = options;

    // 如果是从分享进入，尝试静默登录
    if (from === 'share') {
      this.trySilentLogin();
    }

    this.loadDynamics();
  },

  // 尝试静默登录
  async trySilentLogin() {
    try {
      const loginResult = await auth.silentLogin();

      if (loginResult.isRegistered) {
        console.log('静默登录成功，用户:', loginResult.userInfo.nickName);
        // 刷新动态列表以显示点赞等状态
        this.refreshDynamics();
      } else {
        console.log('用户未注册，以游客身份浏览');
      }
    } catch (error) {
      console.error('静默登录失败:', error);
    }
  },

  onShow() {
    // 从发布页面返回时刷新列表
    if (this.data.shouldRefresh) {
      this.refreshDynamics();
      this.setData({ shouldRefresh: false });
    }
  },

  onPullDownRefresh() {
    this.refreshDynamics();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadDynamics();
    }
  },

  // 刷新动态列表
  refreshDynamics() {
    this.setData({
      page: 1,
      dynamicsList: [],
      hasMore: true
    });
    this.loadDynamics(true);
  },

  // 加载动态列表
  async loadDynamics(isPullRefresh = false) {
    if (this.data.loading) return;
    let openid = wx.getStorageSync('openid')
    this.setData({ loading: true,openid });

    try {
      // 检查云开发是否可用
      if (!wx.cloud || !wx.cloud.callFunction) {
        console.warn('云开发未配置，使用模拟数据');
        this.loadMockData(isPullRefresh);
        return;
      }

      // 查询所有动态，按时间倒序
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize
      };

      const result = await request.callFunction('getUserDynamics', params, {
        showLoad: !isPullRefresh
      });

      const newList = this.data.page === 1 ? result.list : [...this.data.dynamicsList, ...result.list];

      this.setData({
        dynamicsList: openid?newList:[],
        hasMore: result.hasMore,
        loading: false
      });

      if (isPullRefresh) {
        wx.stopPullDownRefresh();
      }
    } catch (error) {
      console.error('加载动态失败:', error);
      // 如果云函数调用失败，使用模拟数据
      this.loadMockData(isPullRefresh);
    }
  },

  // 加载模拟数据（用于开发测试）
  loadMockData(isPullRefresh = false) {
    // 统一的占位图
    const placeholderImage = 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png';

    // 全部动态数据（按时间倒序）
    const mockData = [];

    this.setData({
      dynamicsList: mockData,
      hasMore: false,
      loading: false
    });

    if (isPullRefresh) {
      wx.stopPullDownRefresh();
    }
  },

  // 跳转到发布页面
  goToPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    });
  },

  // 点击用户头像
  onUserTap(e) {
    const userId = e.detail.userId;
    console.log('查看用户:', userId);
    // TODO: 跳转到用户主页
    wx.showToast({
      title: '用户主页开发中',
      icon: 'none'
    });
  },

  // 点赞
  onLike(e) {
    console.log('点赞状态已更新:', e.detail);
    // 点赞功能已在组件内部实现，这里只是接收事件
  },

  // 评论
  onComment(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `/pages/dynamic-detail/dynamic-detail?id=${id}`
    });
  },

  // 分享
  onShare(e) {
    const id = e.detail.id;
    const dynamic = this.data.dynamicsList.find(item => item._id === id);

    if (!dynamic) {
      return;
    }

    // 保存分享信息，供 onShareAppMessage 使用
    this.setData({
      shareInfo: dynamic
    });

    // 触发分享面板
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 删除动态
  onDelete(e) {
    const id = e.detail.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条动态吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteDynamic(id);
        }
      }
    });
  },

  // 执行删除
  async deleteDynamic(id) {
    try {
      wx.showLoading({ title: '删除中...' });

      // TODO: 调用云函数删除动态
      // await request.callFunction('deleteDynamic', { id });

      // 暂时只更新UI
      const newList = this.data.dynamicsList.filter(item => item._id !== id);
      this.setData({
        dynamicsList: newList
      });

      wx.hideLoading();
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
      console.error('删除动态失败:', error);
    }
  },

  // 分享给好友
  onShareAppMessage() {
    const dynamic = this.data.shareInfo;

    if (!dynamic) {
      return {
        title: '发现精彩动态',
        path: '/pages/dynamics/dynamics?from=share'
      };
    }

    // 获取分享标题
    let shareTitle = '';
    if (dynamic.title) {
      shareTitle = dynamic.title;
    } else if (dynamic.content) {
      shareTitle = dynamic.content.length > 30
        ? dynamic.content.substring(0, 30) + '...'
        : dynamic.content;
    } else {
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的动态`;
    }

    // 获取分享图片
    let shareImageUrl = '';
    if (dynamic.images && dynamic.images.length > 0) {
      shareImageUrl = dynamic.images[0];
    }

    const shareData = {
      title: shareTitle,
      path: `/pages/dynamic-detail/dynamic-detail?id=${dynamic._id}&from=share`
    };

    if (shareImageUrl) {
      shareData.imageUrl = shareImageUrl;
    }

    // 清空分享信息
    setTimeout(() => {
      this.setData({ shareInfo: null });
    }, 100);

    return shareData;
  },

  // 分享到朋友圈
  onShareTimeline() {
    const dynamic = this.data.shareInfo;

    if (!dynamic) {
      return {
        title: '发现精彩动态'
      };
    }

    // 获取分享标题
    let shareTitle = '';
    if (dynamic.title) {
      shareTitle = dynamic.title;
    } else if (dynamic.content) {
      shareTitle = dynamic.content.length > 30
        ? dynamic.content.substring(0, 30) + '...'
        : dynamic.content;
    } else {
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的动态`;
    }

    // 获取分享图片
    let shareImageUrl = '';
    if (dynamic.images && dynamic.images.length > 0) {
      shareImageUrl = dynamic.images[0];
    }

    const shareData = {
      title: shareTitle,
      query: `id=${dynamic._id}&from=share`
    };

    if (shareImageUrl) {
      shareData.imageUrl = shareImageUrl;
    }

    // 清空分享信息
    setTimeout(() => {
      this.setData({ shareInfo: null });
    }, 100);

    return shareData;
  }
});
