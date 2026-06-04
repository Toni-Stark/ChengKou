const request = require('../../utils/request.js');

Page({
  data: {
    dynamicId: '',
    displayType: 'grid9',
    content: '',
    title: '',
    video: '',
    images: [],
    location: null,
    submitting: false,
    loaded: false,
    displayTypes: [
      { value: 'grid9', label: '九宫格', desc: '' },
      { value: 'large', label: '大图模式', desc: '' },
      { value: 'video', label: '视频', desc: '' },
      { value: 'text', label: '纯文本', desc: '' }
    ]
  },

  onLoad(options) {
    const { id } = options;
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    this.setData({ dynamicId: id });
    this.loadDynamic();
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

      this.setData({
        displayType: result.displayType || 'grid9',
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
      count: 1, mediaType: ['video'], sourceType: ['album', 'camera'], maxDuration: 60,
      success: (res) => {
        const f = res.tempFiles[0];
        this.setData({ video: f.tempFilePath, thumbnail: f.thumbTempFilePath || '' });
      }
    });
  },

  deleteVideo() { this.setData({ video: '', thumbnail: '' }); },

  async save() {
    const { displayType, content, title, video, images } = this.data;

    if (displayType === 'video' && !video) { wx.showToast({ title: '请选择视频', icon: 'none' }); return; }
    if (displayType === 'large' && (!title.trim() || images.length === 0)) { wx.showToast({ title: '标题和封面图必填', icon: 'none' }); return; }
    if (displayType === 'grid9' && !content.trim() && images.length === 0) { wx.showToast({ title: '请输入内容或添加图片', icon: 'none' }); return; }
    if (displayType === 'text' && !content.trim()) { wx.showToast({ title: '请输入文本', icon: 'none' }); return; }

    if (this.data.submitting) return;
    this.setData({ submitting: true });

    try {
      let uploadedImages = [];
      if (images.length > 0) {
        const qiniuImages = await Promise.all(
          images.filter(i => !i.startsWith('http')).map(i => request.uploadToQiniu(i, 'dynamics'))
        );
        const existingImages = images.filter(i => i.startsWith('http'));
        uploadedImages = [...existingImages, ...qiniuImages];
        if (uploadedImages.length === 0) uploadedImages = images;
      }

      let uploadedVideo = this.data.video;
      if (video && !video.startsWith('http')) {
        uploadedVideo = await request.uploadToQiniu(video, 'videos');
      }

      await request.callFunction('updateDynamic', {
        dynamicId: this.data.dynamicId,
        displayType,
        content: content.trim(),
        title: title.trim(),
        video: uploadedVideo,
        images: uploadedImages
      }, { showLoad: true, loadText: '保存中...' });

      wx.showToast({ title: '修改成功', icon: 'success' });
      setTimeout(() => {
        wx.setStorageSync('_needRefresh', true);
        wx.navigateBack();
      }, 1200);
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
