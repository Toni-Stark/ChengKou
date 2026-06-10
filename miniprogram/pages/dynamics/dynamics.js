const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');
const util = require('../../utils/util.js');

Page({
  data: {
    dynamicsList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    openid: null,
    loading: false,
    shareInfo: null,
    userInfo: null,
    isShow: false,
    filterSubscribed: false,
    youLongShow: 1
  },

  onLoad(options){
    const { from } = options;

    this.syncYouLongShow();

    // 如果是从分享进入，尝试静默登录
    if (from === 'share') {
      this.trySilentLogin();
    }

    // 加载用户信息
    this.loadUserInfo();
    this.loadDynamics();
  },

  // 加载用户信息
  async loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo: userInfo,
          isShow: userInfo.is_show !== false // 默认为true，只有明确设置为false才隐藏
          // isShow: true // 默认为true，只有明确设置为false才隐藏
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  async trySilentLogin() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const openid = wx.getStorageSync('openid');
      if (userInfo && openid) {
        console.log('静默登录成功，用户:', userInfo.nickName);
        this.setData({ openid });
        this.refreshDynamics();
      } else {
        console.log('用户未注册，以游客身份浏览');
      }
    } catch (error) {
      console.warn('静默登录跳过:', error);
    }
  },

  onShow() {
    this.loadUserInfo();
    this.syncYouLongShow();

    if (wx.getStorageSync('_needRefresh')) {
      wx.removeStorageSync('_needRefresh');
      this.refreshDynamics();
    }
  },

  onPullDownRefresh() {
    this.refreshDynamics();
  },

  async syncYouLongShow() {
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
    const openid = wx.getStorageSync('openid');
    this.setData({ loading: true, openid });

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
        pageSize: this.data.pageSize,
        subscribedOnly: this.data.filterSubscribed
      };

      const result = await request.callFunction('getUserDynamics', params, {
        showLoad: !isPullRefresh
      });

      const processedList = await request.processDynamicsImages(result.list);
      const formattedList = processedList.map(item => ({
        ...item,
        displayTime: util.formatRelativeTime(item.createTime)
      }));

      const newList = this.data.page === 1 ? formattedList : [...this.data.dynamicsList, ...formattedList];

      this.setData({
        dynamicsList: newList,
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

  loadMockData(isPullRefresh = false) {
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

  onUserTap(e) {
    const userId = e.detail.userId;
    wx.navigateTo({
      url: `/pages/user-profile/user-profile?id=${userId}`
    });
  },

  // 订阅
  onSubscribe(e) {
    console.log('订阅状态已更新:', e.detail);
  },

  // 切换筛选
  toggleFilter() {
    this.setData({
      filterSubscribed: !this.data.filterSubscribed
    });
    this.refreshDynamics();
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
    const { id, item } = e.detail;
    const dynamic = item || this.data.dynamicsList.find(d => d._id === id);

    if (!dynamic) {
      console.warn('未找到要分享的动态');
      return;
    }

    // 保存分享信息，供 onShareAppMessage 使用
    this.setData({
      shareInfo: dynamic
    });

    console.log('准备分享动态:', dynamic._id);
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

      await request.callFunction('deleteDynamic', { dynamicId: id });

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
        title: '发现精彩游龙',
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
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的游龙`;
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
        title: '发现精彩游龙'
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
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的游龙`;
    }

    // 获取分享图片
    let shareImageUrl2 = '';
    if (dynamic.images && dynamic.images.length > 0) {
      shareImageUrl2 = dynamic.images[0];
    }

    const shareData2 = {
      title: shareTitle,
      query: `id=${dynamic._id}&from=share`
    };

    if (shareImageUrl2) {
      shareData2.imageUrl = shareImageUrl2;
    }

    // 清空分享信息
    setTimeout(() => {
      this.setData({ shareInfo: null });
    }, 100);

    return shareData2;
  }
});
