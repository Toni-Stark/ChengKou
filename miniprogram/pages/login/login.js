const auth = require('../../utils/auth.js');

Page({
  data: {
    loading: false
  },

  onLoad(options) {
    // 检查是否已登录
    if (auth.checkLogin()) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 处理登录
  async handleLogin() {
    if (this.data.loading) {
      return;
    }

    this.setData({ loading: true });

    try {
      // 检查云开发是否初始化
      if (!wx.cloud) {
        wx.showModal({
          title: '提示',
          content: '云开发未初始化，请检查配置',
          showCancel: false
        });
        this.setData({ loading: false });
        return;
      }

      // 获取用户信息
      const userInfo = await auth.getUserProfile();
      console.log('获取到用户信息:', userInfo);

      // 执行登录
      const result = await auth.doLogin(userInfo);
      console.log('登录成功:', result);

      // 登录成功，跳转到首页
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);

    } catch (error) {
      console.error('登录失败:', error);

      // 显示详细错误信息
      const errorMsg = error.message || error.errMsg || '登录失败';
      wx.showModal({
        title: '登录失败',
        content: `错误信息：${errorMsg}\n\n请确保：\n1. login云函数已部署\n2. users集合已创建\n3. 云开发环境已配置`,
        showCancel: false
      });

      this.setData({ loading: false });
    }
  }
});
