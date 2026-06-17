const request = require('../../utils/request.js');

Page({
  data: {
    youLongShow: 1,
    dynamicId: '',
    displayType: 'grid9',
    displayTypeInfo: { value: 'grid9', label: '九宫格', icon: '▦', desc: '分享多张图片和文字', preview: 'grid' },
    content: '',
    title: '',
    video: '',
    videoDuration: 0,
    images: [],
    location: null,
    submitting: false,
    uploading: false,
    uploadProgress: 0,
    loaded: false,
    displayTypes: [
      { value: 'grid9', label: '九宫格', icon: '▦', desc: '分享多张图片和文字', preview: 'grid' },
      { value: 'large', label: '大图', icon: '🖼', desc: '大图封面 + 文字内容', preview: 'large' },
      { value: 'video', label: '视频', icon: '🎬', desc: '分享精彩游姿视频', preview: 'video' },
      { value: 'text', label: '纯文字', icon: '📝', desc: '只分享文字内容', preview: 'text' }
    ]
  },

  async onLoad(options) {
    await this.loadYouLongShow();
    if (!this.data.youLongShow) {
      wx.showToast({ title: '功能暂未开放', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const { id } = options;
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    this.setData({ dynamicId: id });
    this.loadDynamic();
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

  async loadDynamic() {
    try {
      const result = await request.callFunction('getDynamicDetail', {
        dynamicId: this.data.dynamicId
      }, { showLoad: true });

      if (!result) {
        wx.showToast({ title: '游龙不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const dt = result.displayType || 'grid9';
      const dtInfo = this.data.displayTypes.find(d => d.value === dt) || this.data.displayTypes[0];
      this.setData({
        displayType: dt,
        displayTypeInfo: dtInfo,
        content: result.content || '',
        title: result.title || '',
        video: result.video || '',
        images: result.images || [],
        location: result.location || null,
        loaded: true
      });
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onDisplayTypeChange(e) {
    this.setData({ displayType: e.detail.value, images: [], video: '', content: '', title: '' });
  },

  onDisplayTypeTap(e) {
    const { type } = e.currentTarget.dataset;
    if (type === this.data.displayType) return;
    this.setData({ displayType: type, images: [], video: '', content: '', title: '' });
    this.updateDisplayTypeInfo(type);
  },

  updateDisplayTypeInfo(type) {
    const info = this.data.displayTypes.find(d => d.value === type) || this.data.displayTypes[0];
    this.setData({ displayTypeInfo: info });
  },

  onContentInput(e) { this.setData({ content: e.detail.value }); },
  onTitleInput(e) { this.setData({ title: e.detail.value }); },

  chooseImages() {
    const max = this.data.displayType === 'large' ? 1 : 9;
    const cur = this.data.images.length;
    if (cur >= max) return;
    wx.chooseImage({
      count: max - cur,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => this.setData({ images: [...this.data.images, ...res.tempFilePaths] })
    });
  },

  deleteImage(e) {
    this.data.images.splice(e.currentTarget.dataset.index, 1);
    this.setData({ images: this.data.images });
  },

  chooseVideo() {
    wx.chooseMedia({
      count: 1, mediaType: ['video'], sourceType: ['album', 'camera'], maxDuration: 120,
      success: (res) => {
        const f = res.tempFiles[0];
        if (f.duration > 120) {
          wx.showToast({ title: '视频时长不能超过2分钟', icon: 'none' });
          return;
        }
        this.setData({ video: f.tempFilePath, videoDuration: f.duration, thumbnail: f.thumbTempFilePath || '' });
      }
    });
  },

  deleteVideo() { this.setData({ video: '', videoDuration: 0, thumbnail: '' }); },

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
            success: (mRes) => { if (mRes.confirm) wx.openSetting(); }
          });
        }
      }
    });
  },

  removeLocation() {
    this.setData({ location: null });
  },

  async save() {
    const { displayType, content, title, video, videoDuration, images } = this.data;

    if (displayType === 'video') {
      if (!video) { wx.showToast({ title: '请选择视频', icon: 'none' }); return; }
      if (videoDuration > 120) { wx.showToast({ title: '视频时长不能超过2分钟', icon: 'none' }); return; }
    }
    if (displayType === 'large' && (!title.trim() || images.length === 0)) { wx.showToast({ title: '标题和封面图必填', icon: 'none' }); return; }
    if (displayType === 'grid9' && !content.trim() && images.length === 0) { wx.showToast({ title: '请输入内容或添加图片', icon: 'none' }); return; }
    if (displayType === 'text' && !content.trim()) { wx.showToast({ title: '请输入文本', icon: 'none' }); return; }

    if (this.data.submitting) return;
    this.setData({ submitting: true, uploading: true, uploadProgress: 0 });

    try {
      let uploadedImages = [];
      if (images.length > 0) {
        const newImages = images.filter(i => !i.startsWith('http'));
        const existingImages = images.filter(i => i.startsWith('http'));
        const qiniuImages = [];
        for (let i = 0; i < newImages.length; i++) {
          const url = await request.uploadToQiniu(newImages[i], 'dynamics', (progress) => {
            this.setData({ uploadProgress: progress });
          });
          qiniuImages.push(url);
        }
        uploadedImages = [...existingImages, ...qiniuImages];
        if (uploadedImages.length === 0) uploadedImages = images;
      }

      let uploadedVideo = this.data.video;
      if (video && !video.startsWith('http')) {
        this.setData({ uploadProgress: 0 });
        uploadedVideo = await request.uploadToQiniu(video, 'videos', (progress) => {
          this.setData({ uploadProgress: progress });
        });
      }

      this.setData({ uploading: false });

      await request.callFunction('updateDynamic', {
        dynamicId: this.data.dynamicId,
        displayType,
        content: content.trim(),
        title: title.trim(),
        video: uploadedVideo,
        images: uploadedImages,
        location: this.data.location
      }, { showLoad: true, loadText: '保存中...' });

      wx.showToast({ title: '修改成功', icon: 'success' });
      setTimeout(() => {
        wx.setStorageSync('_needRefresh', true);
        wx.navigateBack();
      }, 1200);
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      this.setData({ uploading: false, submitting: false });
    }
  }
});
