const auth = require('../../utils/auth.js');
const request = require('../../utils/request.js');

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
          avatarUrl: userInfo.avatarUrl || 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png',
          nickName: userInfo.nickName || '',
          signature: userInfo.signature || ''
        },
        originalData: {
          avatarUrl: userInfo.avatarUrl || 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png',
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

        wx.showLoading({
          title: '上传中...',
          mask: true
        });

        // 上传到云存储
        const cloudPath = `avatars/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;

        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: tempFilePath,
          success: uploadRes => {
            console.log('上传成功:', uploadRes.fileID);

            // 获取临时链接
            wx.cloud.getTempFileURL({
              fileList: [uploadRes.fileID],
              success: urlRes => {
                wx.hideLoading();

                if (urlRes.fileList && urlRes.fileList.length > 0) {
                  this.setData({
                    'form.avatarUrl': urlRes.fileList[0].tempFileURL
                  });

                  // 保存云文件ID，以便后续使用
                  this.cloudFileID = uploadRes.fileID;
                }
              },
              fail: err => {
                wx.hideLoading();
                console.error('获取临时链接失败:', err);
                request.showToast('头像上传失败');
              }
            });
          },
          fail: err => {
            wx.hideLoading();
            console.error('上传失败:', err);
            request.showToast('头像上传失败');
          }
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
      if (this.cloudFileID) {
        updateData.avatarUrl = this.cloudFileID;
      }

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
