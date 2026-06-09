const request = require('../../utils/request.js');

Page({
  data: {
    youLongShow: 1,
    displayType: 'grid9',
    content: '',
    title: '',
    video: '',
    subtitle: '',
    images: [],
    location: null,
    submitting: false,
    displayTypes: [
      { value: 'grid9', label: '九宫格', desc: '适合分享多张图片和文字' },
      { value: 'large', label: '大图模式', desc: '适合展示精美图片和标题' },
      { value: 'video', label: '视频', desc: '分享精彩泳姿视频' },
      { value: 'text', label: '纯文本', desc: '只分享文字内容' }
    ]
  },
  async onLoad() {
    await this.loadYouLongShow();
    if (!this.data.youLongShow) {
      wx.showToast({ title: '功能暂未开放', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const userInfo = wx.getStorageSync('userInfo');
    const openid = wx.getStorageSync('openid');
    if (!userInfo || !openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发布游龙',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
      return;
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

  onDisplayTypeChange(e) {
    this.setData({
      displayType: e.detail.value
    });
  },

  onContentInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    });
  },

  onSubtitleInput(e) {
    this.setData({
      subtitle: e.detail.value
    });
  },

  chooseImages() {
    const maxCount = this.data.displayType === 'large' ? 1 : 9;
    const currentCount = this.data.images.length;

    if (currentCount >= maxCount) {
      request.showToast(`最多只能选择${maxCount}张图片`);
      return;
    }

    wx.chooseImage({
      count: maxCount - currentCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        });
      }
    });
  },

  chooseVideo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        const file = res.tempFiles[0];
        this.setData({
          video: file.tempFilePath,
          thumbnail: file.thumbTempFilePath || ''
        });
      }
    });
  },

  previewVideo() {
    if (!this.data.video) return;
    wx.previewMedia({
      sources: [{ url: this.data.video, type: 'video' }],
      current: 0
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({ images });
  },

  deleteVideo() {
    this.setData({ video: '', thumbnail: '' });
  },

  onVideoError(e) {
    console.error('视频加载失败:', e.detail);
    wx.showToast({ title: '视频加载失败，请重试', icon: 'none' });
  },

  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: {
            name: res.name,
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要位置权限才能选择位置',
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },

  removeLocation() {
    this.setData({
      location: null
    });
  },

  async publish() {
    const { displayType, content, title, subtitle, video, images, location } = this.data;

    if (displayType === 'video') {
      if (!video) {
        request.showToast('请选择视频');
        return;
      }
    } else if (displayType === 'large') {
      if (!title.trim()) {
        request.showToast('请输入标题');
        return;
      }
      if (images.length === 0) {
        request.showToast('请选择图片');
        return;
      }
    } else if (displayType === 'grid9') {
      if (!content.trim() && images.length === 0) {
        request.showToast('请输入内容或添加图片');
        return;
      }
    } else if (displayType === 'text') {
      if (!content.trim()) {
        request.showToast('请输入文本内容');
        return;
      }
    }

    if (this.data.submitting) return;

    this.setData({ submitting: true });

    try {
      // 检查云开发是否可用
      if (!wx.cloud || !wx.cloud.callFunction) {
        console.warn('云开发未配置，模拟发布成功');
        request.showToast('发布成功（模拟）', 'success');

        setTimeout(() => {
          wx.navigateBack();
        }, 1500);

        this.setData({ submitting: false });
        return;
      }

      // 上传图片到云存储
      let uploadedImages = [];
      if (images.length > 0) {
        const qiniuImages = await Promise.all(
          images.map(img => request.uploadToQiniu(img, 'dynamics'))
        );
        uploadedImages = qiniuImages;
      }

      let uploadedVideo = '';
      if (video) {
        uploadedVideo = await request.uploadToQiniu(video, 'videos');
      }

      await request.callFunction('publishDynamic', {
        displayType,
        content: content.trim(),
        title: title.trim(),
        subtitle: (subtitle || '').trim(),
        video: uploadedVideo,
        images: uploadedImages,
        location
      }, {
        showLoad: true,
        loadText: '发布中...'
      });

      request.showToast('发布成功', 'success');

      wx.setStorageSync('_needRefresh', true);

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('发布失败:', error);
      const msg = error.errMsg || error.message || '';
      if (msg.includes('FUNCTION_NOT_FOUND')) {
        wx.showModal({ title: '发布失败', content: 'publishDynamic 云函数未部署，请在开发者工具中右键 cloudfunctions/publishDynamic → 上传并部署', showCancel: false });
      } else {
        wx.showToast({ title: '发布失败，请重试', icon: 'none' });
      }
    } finally {
      this.setData({ submitting: false });
    }
  }
});
