// 获取管理员 openid 的临时页面
const app = getApp();

Page({
  data: {
    openid: ''
  },

  onLoad() {
    this.getOpenid();
  },

  /**
   * 获取当前用户的 openid
   */
  async getOpenid() {
    try {
      wx.showLoading({ title: '获取中...' });

      // 方法1：从全局数据中获取（如果已登录）
      if (app.globalData.openid) {
        this.setData({ openid: app.globalData.openid });
        wx.hideLoading();
        return;
      }

      // 方法2：调用云函数获取
      const result = await wx.cloud.callFunction({
        name: 'getOpenid',
        data: {}
      });

      if (result.result && result.result.openid) {
        const openid = result.result.openid;
        this.setData({ openid });
        app.globalData.openid = openid;

        wx.hideLoading();
        wx.showToast({
          title: 'OpenID 获取成功',
          icon: 'success'
        });
      } else {
        throw new Error('获取 openid 失败');
      }
    } catch (error) {
      console.error('获取 openid 失败:', error);
      wx.hideLoading();

      // 显示详细的错误提示
      let content = '请按以下步骤操作：\n\n';
      content += '1. 在开发者工具中找到 cloudfunctions/getOpenid 文件夹\n';
      content += '2. 右键点击 → 选择"上传并部署：云端安装依赖"\n';
      content += '3. 等待上传完成后，重新打开此页面';

      wx.showModal({
        title: '需要上传云函数',
        content: content,
        showCancel: false,
        confirmText: '我知道了'
      });
    }
  },

  /**
   * 复制 openid 到剪贴板
   */
  copyOpenid() {
    if (!this.data.openid) {
      wx.showToast({
        title: '暂无 OpenID',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: this.data.openid,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  }
});
