const QINIU_BASE = 'http://tg00h6qkg.hn-bkt.clouddn.com';
const DEFAULT_AVATAR = QINIU_BASE + '/common/default-avatar.png';

Page({
  data: {
    form: {
      avatarUrl: '',
      nickName: '',
      signature: ''
    },
    originalData: {},
    saving: false
  },

  onLoad() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    const stored = auth.getStoredUserInfo();

    if (stored.userInfo) {
      const userInfo = stored.userInfo;
      this.setData({
        form: {
          avatarUrl: userInfo.avatarUrl || DEFAULT_AVATAR,
          nickName: userInfo.nickName || '',
          signature: userInfo.signature || ''
        },
        originalData: {
          avatarUrl: userInfo.avatarUrl || DEFAULT_AVATAR,
          nickName: userInfo.nickName || '',
          signature: userInfo.signature || ''
        }
      });
    }
  },

  // 选择头像
  chooseAvatar(e) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;

        wx.showLoading({ title: '上传中...', mask: true });

        request.uploadToQiniu(tempFilePath, 'avatars').then(qiniuUrl => {
          wx.hideLoading();
          this.setData({ 'form.avatarUrl': qiniuUrl });
        }).catch(() => {
          wx.hideLoading();
          request.showToast('头像上传失败');
        });
      },
      fail: err => {
        console.log('选择图片失败:', err);
      }
    });
  },

  // 输入昵称
  onNickNameInput(e) {
    console.log(e);
    this.setData({
      'form.nickName': e.detail.value
    });
  },

  // 输入签名
  onSignatureInput(e) {

    this.setData({
      'form.signature': e.detail.value
    });
  },

  // 保存资料
  async saveProfile() {
    if (this.data.saving) {
      return;
    }
    const { form, originalData } = this.data;

    // 验证昵称
    if (!form.nickName || form.nickName.trim() === '') {
      request.showToast('请输入昵称');
      return;
    }

    // 检查是否有修改
    if (form.nickName === originalData.nickName &&
        form.signature === originalData.signature &&
        form.avatarUrl === originalData.avatarUrl) {
      request.showToast('没有修改');
      return;
    }

    this.setData({ saving: true });

    try {
      // 调用云函数更新用户信息
      const updateData = {
        nickName: form.nickName.trim(),
        signature: form.signature.trim()
      };

      // 如果上传了新头像，使用云文件ID
      updateData.avatarUrl = form.avatarUrl;

      console.log(updateData, 'form')
      const result = await request.callFunction('updateUserInfo', updateData, {
        loadText: '保存中...'
      });

      // 更新本地存储
      const stored = auth.getStoredUserInfo();
      const updatedUserInfo = {
        ...stored.userInfo,
        ...result
      };
      auth.saveUserInfo(updatedUserInfo, stored.openid);

      request.showToast('保存成功', 'success');

      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('保存失败:', error);
      request.showToast('保存失败，请重试');
      this.setData({ saving: false });
    }
  }
});
