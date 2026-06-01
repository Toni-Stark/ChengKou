const auth = require('../../utils/auth.js');
const request = require('../../utils/request.js');

Page({
  data: {
    isLogin: false,
    cacheSize: '计算中...',
    version: '1.0.0'
  },

  onLoad() {
    this.checkLogin();
    this.calculateCacheSize();
  },

  // 检查登录状态
  checkLogin() {
    this.setData({
      isLogin: auth.checkLogin()
    });
  },

  // 计算缓存大小
  calculateCacheSize() {
    try {
      const res = wx.getStorageInfoSync();
      const sizeKB = res.currentSize;

      let sizeText = '';
      if (sizeKB < 1024) {
        sizeText = sizeKB + ' KB';
      } else {
        sizeText = (sizeKB / 1024).toFixed(2) + ' MB';
      }

      this.setData({
        cacheSize: sizeText
      });
    } catch (error) {
      console.error('获取缓存大小失败:', error);
      this.setData({
        cacheSize: '未知'
      });
    }
  },

  // 编辑资料
  editProfile() {
    if (!this.data.isLogin) {
      request.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }, 1500);
      return;
    }

    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？清除后需要重新加载数据',
      success: (res) => {
        if (res.confirm) {
          try {
            // 保留用户登录信息
            const userInfo = wx.getStorageSync('userInfo');
            const openid = wx.getStorageSync('openid');

            // 清除所有缓存
            wx.clearStorageSync();

            // 恢复用户登录信息
            if (userInfo && openid) {
              wx.setStorageSync('userInfo', userInfo);
              wx.setStorageSync('openid', openid);
            }

            wx.showToast({
              title: '清除成功',
              icon: 'success'
            });

            // 重新计算缓存大小
            setTimeout(() => {
              this.calculateCacheSize();
            }, 1000);

          } catch (error) {
            console.error('清除缓存失败:', error);
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 关于我们
  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '这是一个基于微信小程序的社交平台，用户可以发布游龙、评论、订阅其他用户。\n\n技术栈：\n- 小程序云开发\n- 微信云数据库\n- 微信云函数\n- 微信云存储',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 版本信息
  showVersion() {
    wx.showModal({
      title: '版本信息',
      content: `当前版本：${this.data.version}\n\n更新日志：\n- 支持发布游龙\n- 支持订阅用户\n- 支持评论互动\n- 支持编辑资料\n- 支持查看我的游龙\n- 支持管理订阅\n- 支持今日打卡`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 退出登录
  logout() {
    auth.logout();
  }
});
