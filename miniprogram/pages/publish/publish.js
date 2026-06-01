const request = require('../../utils/request.js');

Page({
  data: {
    displayType: 'grid9', // grid9 | large | text
    content: '',
    title: '',
    subtitle: '',
    images: [],
    location: null,
    submitting: false,
    loading: false,
    displayTypes: [
      { value: 'grid9', label: '九宫格', desc: '适合分享多张图片和文字' },
      { value: 'large', label: '大图模式', desc: '适合展示精美图片和标题' },
      { value: 'text', label: '纯文本', desc: '只分享文字内容' }
    ]
  },
  async getGlobalConfig(){
    const cached = wx.getStorageSync('globalConfig_registration');
    if (cached && Date.now() - cached.time < 5 * 60 * 1000) {
      this.setData({ loading: cached.visible });
      return;
    }

    const res = await request.callFunction('getGlobalConfig', {
      key: 'registration_form'
    }, {
      showLoad: false,
      showError: false
    });

    let visible = res?.visible;
    if (visible !== undefined) {
      wx.setStorageSync('globalConfig_registration', { visible, time: Date.now() });
      this.setData({ loading: visible });
    }
  },
  onLoad() {
    this.getGlobalConfig()
    // 检查用户的 is_show 权限
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || userInfo.is_show === false) {
      wx.showModal({
        title: '提示',
        content: '您暂无发布游龙的权限',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
      return;
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

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({ images });
  },

  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: {
            name: res.name || res.address,
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
    const { displayType, content, title, subtitle, images, location } = this.data;

    // 验证
    if (displayType === 'large') {
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
        uploadedImages = await request.uploadImages(images, 'dynamics');
      }

      await request.callFunction('publishDynamic', {
        displayType,
        content: content.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
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
    } finally {
      this.setData({ submitting: false });
    }
  }
});
