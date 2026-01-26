const request = require('../../utils/request.js');

Page({
  data: {
    // 最新动态数据
    featuredDynamic: {
      title: '欢迎来到游泳教学平台',
      desc: '专业游泳教学，安全高效',
      image: 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png' // 使用占位图，实际可以从云端获取
    },
    // 联系方式
    contactInfo: {
      wechat: 'lllh2033',
      qq: '3209233073'
    }
  },

  onLoad() {
    // 加载最新动态（可以从云端获取）
    this.loadFeaturedDynamic();
  },

  // 加载最新动态
  async loadFeaturedDynamic() {
    // TODO: 从云端获取最新动态数据
    // 这里使用模拟数据
    const mockData = {
      title: '2026游泳春训班开始报名',
      desc: '专业教练团队，小班教学',
      image: 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png'
    };

    // 处理图片URL - 将cloud://转换为临时HTTP链接，解决iOS显示问题
    try {
      const convertedImage = await request.getTempFileURL(mockData.image);
      mockData.image = convertedImage;
    } catch (error) {
      console.error('转换图片URL失败:', error);
    }

    this.setData({
      featuredDynamic: mockData
    });
  },

  // 点击最新动态卡片
  onFeaturedCardTap() {
    wx.navigateTo({
      url: '/pages/featured-detail/featured-detail'
    });
    // wx.navigateTo({
      // url: '/pages/get-openid/get-openid'
    // });
  },

  // 点击游泳教学视频Tab
  onVideoTabTap() {
    wx.showModal({
      title: '游泳教学视频',
      content: '即将上线精品教学视频课程',
      showCancel: false
    });
  },

  // 点击教练认证Tab
  onCertificationTabTap() {
    wx.showModal({
      title: '教练认证',
      content: '教练认证申请功能开发中',
      showCancel: false
    });
  },

  // 复制微信号
  onCopyWechat(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  // 复制QQ号
  onCopyQQ(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: 'QQ号已复制',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '游泳教学平台',
      path: '/pages/index/index',
      imageUrl: this.data.featuredDynamic.image
    };
  }
});
