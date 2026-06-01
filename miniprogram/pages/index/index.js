const request = require('../../utils/request.js');
const strokesData = require('../../data/strokes.js');

Page({
  data: {
    featuredDynamic: {
      title: '欢迎来到游泳教学平台',
      desc: '专业游泳教学，安全高效',
      image: ''
    },
    contactInfo: {
      wechat: 'lllh2033',
      qq: '3209233073'
    },
    strokes: strokesData,
  },

  onLoad() {
    this.loadFeaturedDynamic();
  },

  async loadFeaturedDynamic() {
    const mockData = {
      title: '2026游泳春训班开始报名',
      desc: '专业教练团队，小班教学',
      image: ''
    };

    try {
      const convertedImage = await request.getTempFileURL(
        'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png'
      );
      mockData.image = convertedImage;
    } catch (error) {
      console.error('转换图片URL失败:', error);
    }

    this.setData({ featuredDynamic: mockData });
  },

  onFeaturedCardTap() {
    wx.navigateTo({
      url: '/pages/featured-detail/featured-detail'
    });
  },

  onStrokeTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/stroke-detail/stroke-detail?id=${id}`
    });
  },

  onCoachTap() {
    wx.navigateTo({ url: '/pages/coach-detail/coach-detail' });
  },

  onLifeguardTap() {
    wx.navigateTo({ url: '/pages/lifeguard-detail/lifeguard-detail' });
  },

  onCopyWechat(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: () => wx.showToast({ title: '微信号已复制', icon: 'success' })
    });
  },

  onCopyQQ(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: () => wx.showToast({ title: 'QQ号已复制', icon: 'success' })
    });
  },

  onShareAppMessage() {
    return {
      title: '游泳教学平台',
      path: '/pages/index/index',
      imageUrl: this.data.featuredDynamic.image
    };
  }
});
